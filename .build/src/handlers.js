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
exports.listProduct = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.createProduct = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const yup = __importStar(require("yup"));
const docClient = new aws_sdk_1.default.DynamoDB.DocumentClient();
const tableName = "ProductsTable";
const headers = {
    "content-type": "application/json",
};
const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
    price: yup.number().required(),
    available: yup.bool().required(),
});
const createProduct = async (event) => {
    try {
        const reqBody = JSON.parse(event.body);
        await schema.validate(reqBody, { abortEarly: false });
        const product = Object.assign(Object.assign({}, reqBody), { productID: (0, uuid_1.v4)() });
        await docClient
            .put({
            TableName: tableName,
            Item: product,
        })
            .promise();
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify(product),
        };
    }
    catch (e) {
        return handleError(e);
    }
};
exports.createProduct = createProduct;
class HttpError extends Error {
    constructor(statusCode, body = {}) {
        super(JSON.stringify(body));
        this.statusCode = statusCode;
    }
}
const fetchProductById = async (id) => {
    const output = await docClient
        .get({
        TableName: tableName,
        Key: {
            productID: id,
        },
    })
        .promise();
    if (!output.Item) {
        throw new HttpError(404, { error: "not found" });
    }
    return output.Item;
};
const handleError = (e) => {
    if (e instanceof yup.ValidationError) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                errors: e.errors,
            }),
        };
    }
    if (e instanceof SyntaxError) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: `invalid request body format : "${e.message}"` }),
        };
    }
    if (e instanceof HttpError) {
        return {
            statusCode: e.statusCode,
            headers,
            body: e.message,
        };
    }
    throw e;
};
const getProduct = async (event) => {
    var _a;
    try {
        const product = await fetchProductById((_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(product),
        };
    }
    catch (e) {
        return handleError(e);
    }
};
exports.getProduct = getProduct;
const updateProduct = async (event) => {
    var _a;
    try {
        const id = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
        await fetchProductById(id);
        const reqBody = JSON.parse(event.body);
        await schema.validate(reqBody, { abortEarly: false });
        const product = Object.assign(Object.assign({}, reqBody), { productID: id });
        await docClient
            .put({
            TableName: tableName,
            Item: product,
        })
            .promise();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(product),
        };
    }
    catch (e) {
        return handleError(e);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (event) => {
    var _a;
    try {
        const id = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
        await fetchProductById(id);
        await docClient
            .delete({
            TableName: tableName,
            Key: {
                productID: id,
            },
        })
            .promise();
        return {
            statusCode: 204,
            body: "",
        };
    }
    catch (e) {
        return handleError(e);
    }
};
exports.deleteProduct = deleteProduct;
const listProduct = async (event) => {
    const output = await docClient
        .scan({
        TableName: tableName,
    })
        .promise();
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(output.Items),
    };
};
exports.listProduct = listProduct;
//# sourceMappingURL=handlers.js.map