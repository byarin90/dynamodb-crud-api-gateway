"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../../consts");
const logger_1 = require("../logger");
const parse_body_1 = __importDefault(require("./parse-body"));
const getRequestFromEvent = (event) => {
    const { requestContext, headers, pathParameters, queryStringParameters, body, } = event;
    let clientId;
    let userId;
    let name;
    if (requestContext?.authorizer?.jwt?.claims) {
        const { sub: spaUserId, azp: appId, [`${consts_1.AUTH0_API_IDENTIFIER}/userId`]: m2mUserId, [`${consts_1.AUTH0_API_IDENTIFIER}/clientId`]: appMetadataClientId, [`${consts_1.AUTH0_API_IDENTIFIER}/name`]: customName, [`${consts_1.AUTH0_API_IDENTIFIER}/useEncoding`]: customUseEncoding, } = requestContext.authorizer.jwt.claims;
        name = customName;
        userId = m2mUserId ?? spaUserId;
        clientId = appMetadataClientId ?? appId;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lowerCasedHeaders = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(headers ?? {}).forEach(([key, val]) => {
        lowerCasedHeaders[key.toLowerCase()] = val;
    });
    logger_1.logger.addExecutionContext({
        name,
        clientId,
        userId,
        userAgent: lowerCasedHeaders['user-agent'],
        ip: lowerCasedHeaders['cf-connecting-ip'],
    });
    const req = {
        name,
        clientId,
        userId,
        headers: lowerCasedHeaders,
        params: pathParameters ?? {},
        query: queryStringParameters ?? {},
        body: body ? (0, parse_body_1.default)(body) : {},
        rawBody: body,
    };
    return req;
};
exports.default = getRequestFromEvent;
//# sourceMappingURL=get-request.js.map