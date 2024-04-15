"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformError = exports.StandardError = void 0;
const joi_1 = __importDefault(require("joi"));
const axios_1 = __importDefault(require("axios"));
class StandardError extends Error {
    constructor(message, type, statusCode) {
        super(message);
        this.type = type ?? 'INTERNAL_ERROR';
        this.statusCode = statusCode ?? 500;
    }
}
exports.StandardError = StandardError;
const transformError = (e) => {
    const error = {};
    if (e instanceof joi_1.default.ValidationError) {
        // Joi
        error.statusCode = 400;
        error.type = 'CLIENT_ERROR';
        error.message = JSON.stringify(e.details?.map((obj) => obj.message) ?? 'Validation error');
    }
    else if (axios_1.default.isAxiosError(e)) {
        // Axios
        error.statusCode = Number(e.response?.status ?? 500);
        error.type = 'CLIENT_ERROR';
        error.message = JSON.stringify(e.response?.data);
    }
    else {
        // new StandardError() || new Error()
        error.statusCode = e?.statusCode ?? e?.status ?? 500;
        error.type = e?.type ?? 'INTERNAL_ERROR';
        error.message = e?.message ?? 'An unexpected server error has occurred';
    }
    error.stack = e?.stack ?? 'Stack unavailable';
    return error;
};
exports.transformError = transformError;
//# sourceMappingURL=error-handling.js.map