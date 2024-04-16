"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
const error_handling_1 = require("./error-handling");
const logger_1 = require("../logger");
const parseBody = (requestBody) => {
    try {
        return JSON.parse(requestBody);
    }
    catch (e1) {
        try {
            const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
            if (base64regex.test(requestBody)) {
                return qs_1.default.parse(Buffer.from(requestBody, 'base64').toString('ascii'));
            }
            return qs_1.default.parse(requestBody);
        }
        catch (e2) {
            logger_1.logger.error('Failed to parse body', { requestBody, error: e2 });
            throw new error_handling_1.StandardError('Body is not valid', 'CLIENT_ERROR', 400);
        }
    }
};
exports.default = parseBody;
//# sourceMappingURL=parse-body.js.map