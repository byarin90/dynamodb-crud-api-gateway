import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid';
import * as yup from "yup";
import createDynamoClient from "./lib/dynamoDB/create-dynamo-client";
import { logger } from "./lib/logger";

const tableName = "productTable";
const headers = { "content-type": "application/json" };

const dynamoClient = createDynamoClient();
class HttpError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
  }
}

const handleError = (error: unknown): APIGatewayProxyResult => {
  if (error instanceof yup.ValidationError) {
    return { statusCode: 400, headers, body: JSON.stringify({ errors: error.errors }) };
  } else if (error instanceof HttpError) {
    return { statusCode: error.statusCode, headers, body: JSON.stringify({ error: error.message }) };
  } else if (error instanceof SyntaxError) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: `Invalid request body format: ${error.message}` }) };
  } else {
    console.error(error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Internal server error" }) };
  }
};


const productSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  available: yup.bool().required(),
});

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const reqBody = JSON.parse(event.body || '{}');
    await productSchema.validate(reqBody);

    const productID = uuidv4();
    const item = {
      PK: `PRODUCT#${productID}`,
      SK: `METADATA#${productID}`,
      ...reqBody,
    };
    logger.info('item', item)
    await dynamoClient.put({ TableName: tableName, Item: item });
    return { statusCode: 201, headers, body: JSON.stringify(item) };
    // return { statusCode: 201, body: JSON.stringify({ message: 'Product created' }) };
  } catch (error) {
    return handleError(error);
  }
};
export const getProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {

    const { id } = event.pathParameters || {};
    if (!id) throw new HttpError(400, "Product ID is required");

    const PK = `PRODUCT#${id}`;
    const SK = `METADATA#${id}`;

    const { Item } = await dynamoClient.get({ TableName: tableName, Key: { PK, SK } });
    if (!Item) throw new HttpError(404, "Product not found");

    return { statusCode: 200, headers, body: JSON.stringify(Item) };
  } catch (error) {
    return handleError(error);
  }
};


export const updateProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters || {};
    const reqBody = JSON.parse(event.body || '{}');
    await productSchema.validate(reqBody);

    const PK = `PRODUCT#${id}`;
    const SK = `METADATA#${id}`;

    const existingProduct = await dynamoClient.get({ TableName: tableName, Key: { PK, SK } });
    if (!existingProduct.Item) throw new HttpError(404, "Product not found");

    const updatedItem = {
      ...existingProduct.Item,
      ...reqBody,
    };

    await dynamoClient.put({ TableName: tableName, Item: updatedItem });
    return { statusCode: 200, headers, body: JSON.stringify(updatedItem) };
  } catch (error) {
    return handleError(error);
  }
};



export const deleteProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters || {};
    if (!id) throw new HttpError(400, "Product ID is required");

    const PK = `PRODUCT#${id}`;
    const SK = `METADATA#${id}`;

    await dynamoClient.delete({ TableName: tableName, Key: { PK, SK } });
    return { statusCode: 204, headers, body: "" };
  } catch (error) {
    return handleError(error);
  }
};
