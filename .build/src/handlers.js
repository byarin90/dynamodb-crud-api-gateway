"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.createProduct = void 0;
const uuid_1 = require("uuid");
const yup = __importStar(require("yup"));
const create_dynamo_client_1 = __importDefault(require("./lib/dynamoDB/create-dynamo-client"));
const logger_1 = require("./lib/logger");
const tableName = "productTable";
const headers = { "content-type": "application/json" };
const dynamoClient = (0, create_dynamo_client_1.default)();
class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}
const handleError = (error) => {
    if (error instanceof yup.ValidationError) {
        return { statusCode: 400, headers, body: JSON.stringify({ errors: error.errors }) };
    }
    else if (error instanceof HttpError) {
        return { statusCode: error.statusCode, headers, body: JSON.stringify({ error: error.message }) };
    }
    else if (error instanceof SyntaxError) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: `Invalid request body format: ${error.message}` }) };
    }
    else {
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
const createProduct = async (event) => {
    try {
        const reqBody = JSON.parse(event.body || '{}');
        await productSchema.validate(reqBody);
        const productID = (0, uuid_1.v4)();
        const item = {
            PK: `PRODUCT#${productID}`,
            SK: `METADATA#${productID}`,
            ...reqBody,
        };
        logger_1.logger.info('item', item);
        await dynamoClient.put({ TableName: tableName, Item: item });
        return { statusCode: 201, headers, body: JSON.stringify(item) };
        // return { statusCode: 201, body: JSON.stringify({ message: 'Product created' }) };
    }
    catch (error) {
        return handleError(error);
    }
};
exports.createProduct = createProduct;
const getProduct = async (event) => {
    try {
        const { id } = event.pathParameters || {};
        if (!id)
            throw new HttpError(400, "Product ID is required");
        const PK = `PRODUCT#${id}`;
        const SK = `METADATA#${id}`;
        const { Item } = await dynamoClient.get({ TableName: tableName, Key: { PK, SK } });
        if (!Item)
            throw new HttpError(404, "Product not found");
        return { statusCode: 200, headers, body: JSON.stringify(Item) };
    }
    catch (error) {
        return handleError(error);
    }
};
exports.getProduct = getProduct;
const updateProduct = async (event) => {
    try {
        const { id } = event.pathParameters || {};
        const reqBody = JSON.parse(event.body || '{}');
        await productSchema.validate(reqBody);
        const PK = `PRODUCT#${id}`;
        const SK = `METADATA#${id}`;
        const existingProduct = await dynamoClient.get({ TableName: tableName, Key: { PK, SK } });
        if (!existingProduct.Item)
            throw new HttpError(404, "Product not found");
        const updatedItem = {
            ...existingProduct.Item,
            ...reqBody,
        };
        await dynamoClient.put({ TableName: tableName, Item: updatedItem });
        return { statusCode: 200, headers, body: JSON.stringify(updatedItem) };
    }
    catch (error) {
        return handleError(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (event) => {
    try {
        const { id } = event.pathParameters || {};
        if (!id)
            throw new HttpError(400, "Product ID is required");
        const PK = `PRODUCT#${id}`;
        const SK = `METADATA#${id}`;
        await dynamoClient.delete({ TableName: tableName, Key: { PK, SK } });
        return { statusCode: 204, headers, body: "" };
    }
    catch (error) {
        return handleError(error);
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=handlers.js.map