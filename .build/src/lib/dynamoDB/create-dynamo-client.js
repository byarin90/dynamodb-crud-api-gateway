"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dotenv_1 = require("dotenv");
const consts_1 = require("../../consts");
(0, dotenv_1.config)();
const createDynamoClient = () => {
    let dynamoClient = null;
    if (!dynamoClient) {
        const client = new client_dynamodb_1.DynamoDBClient({
            region: consts_1.AWS_REGION,
            endpoint: process.env.IS_OFFLINE ? consts_1.DYNAMO_DB_URI : undefined,
            retryMode: 'adaptive',
            maxAttempts: 5,
        });
        const marshallOptions = {
            convertEmptyValues: true,
            removeUndefinedValues: true,
            convertClassInstanceToMap: true,
        };
        const translateConfig = { marshallOptions };
        dynamoClient = lib_dynamodb_1.DynamoDBDocument.from(client, translateConfig);
        return dynamoClient;
    }
    return dynamoClient;
};
exports.default = createDynamoClient;
//# sourceMappingURL=create-dynamo-client.js.map