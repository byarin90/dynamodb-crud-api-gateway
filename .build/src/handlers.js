"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.createProduct = exports.healthCheck = void 0;
const uuid_1 = require("uuid");
const joi_1 = __importDefault(require("joi"));
const create_dynamo_client_1 = __importDefault(require("./lib/dynamoDB/create-dynamo-client"));
const logger_1 = require("./lib/logger");
const send_response_1 = __importDefault(require("./lib/serverless/send-response"));
const error_handling_1 = require("./lib/serverless/error-handling");
const get_request_1 = __importDefault(require("./lib/serverless/get-request"));
const tableName = process.env.PRODUCT_TABLE_NAME || "productTable";
const dynamoClient = (0, create_dynamo_client_1.default)();
const healthCheck = async () => {
    return (0, send_response_1.default)(200, { message: 'Service is up and running' });
};
exports.healthCheck = healthCheck;
const productSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    available: joi_1.default.boolean().required(),
});
const createProduct = async (event) => {
    try {
        const { body, } = (0, get_request_1.default)(event);
        const validatedBody = await productSchema.validateAsync(body);
        const productID = (0, uuid_1.v4)();
        const item = {
            PK: `PRODUCT`,
            SK: `PRODUCT#${productID}`,
            ...validatedBody,
        };
        logger_1.logger.info('Creating item', { item });
        await dynamoClient.put({ TableName: tableName, Item: item });
        return (0, send_response_1.default)(201, item);
    }
    catch (error) {
        const e = (0, error_handling_1.transformError)(error);
        logger_1.logger.error(e.message, { type: e.type, stack: e.stack });
        return await (0, send_response_1.default)(e.statusCode, {
            type: e.type,
            message: e.message,
        });
    }
};
exports.createProduct = createProduct;
const getProduct = async (event) => {
    try {
        const { params: { id }, } = (0, get_request_1.default)(event);
        if (!id)
            throw new error_handling_1.StandardError('Product ID is required', 'CLIENT_ERROR', 400);
        const key = {
            PK: `PRODUCT`,
            SK: `PRODUCT#${id}`,
        };
        logger_1.logger.info('Retrieving product', { key });
        const { Item } = await dynamoClient.get({ TableName: tableName, Key: key });
        if (!Item)
            throw new error_handling_1.StandardError('Product not found', 'CLIENT_ERROR', 404);
        return (0, send_response_1.default)(200, Item);
    }
    catch (error) {
        const e = (0, error_handling_1.transformError)(error);
        logger_1.logger.error(e.message, { type: e.type, stack: e.stack });
        return await (0, send_response_1.default)(e.statusCode, {
            type: e.type,
            message: e.message,
        });
    }
};
exports.getProduct = getProduct;
const updateProduct = async (event) => {
    try {
        const { params: { id }, body } = (0, get_request_1.default)(event);
        const validatedBody = await productSchema.validateAsync(body);
        const key = {
            PK: `PRODUCT`,
            SK: `PRODUCT#${id}`,
        };
        logger_1.logger.info('Updating product', { key });
        const { Item } = await dynamoClient.get({ TableName: tableName, Key: key });
        if (!Item)
            throw new error_handling_1.StandardError('Product not found', 'CLIENT_ERROR', 404);
        const updatedItem = { ...Item, ...validatedBody };
        await dynamoClient.put({ TableName: tableName, Item: updatedItem });
        return (0, send_response_1.default)(200, updatedItem);
    }
    catch (error) {
        const e = (0, error_handling_1.transformError)(error);
        logger_1.logger.error(e.message, { type: e.type, stack: e.stack });
        return await (0, send_response_1.default)(e.statusCode, {
            type: e.type,
            message: e.message,
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (event) => {
    try {
        const { params: { id }, } = (0, get_request_1.default)(event);
        if (!id)
            throw new error_handling_1.StandardError('Product ID is required', 'CLIENT_ERROR', 400);
        const key = {
            PK: `PRODUCT`,
            SK: `PRODUCT#${id}`,
        };
        logger_1.logger.info('Deleting product', { key });
        await dynamoClient.delete({ TableName: tableName, Key: key });
        return (0, send_response_1.default)(204, {});
    }
    catch (error) {
        const e = (0, error_handling_1.transformError)(error);
        logger_1.logger.error(e.message, { type: e.type, stack: e.stack });
        return await (0, send_response_1.default)(e.statusCode, {
            type: e.type,
            message: e.message,
        });
    }
};
exports.deleteProduct = deleteProduct;
const getProducts = async (event) => {
    try {
        const { Items } = await dynamoClient.query({
            TableName: tableName,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'PRODUCT'
            }
        });
        if (!Items)
            throw new error_handling_1.StandardError('No products found', 'CLIENT_ERROR', 404);
        logger_1.logger.info('Fetched products', { count: Items.length });
        return (0, send_response_1.default)(200, Items);
    }
    catch (error) {
        const e = (0, error_handling_1.transformError)(error);
        logger_1.logger.error(e.message, { type: e.type, stack: e.stack });
        return await (0, send_response_1.default)(e.statusCode, {
            type: e.type,
            message: e.message,
        });
    }
};
exports.getProducts = getProducts;
//# sourceMappingURL=handlers.js.map