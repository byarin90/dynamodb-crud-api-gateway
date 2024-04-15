"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (statusCode = 200, body = {}, headers = {}) => new Promise((resolve) => {
    resolve({
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(body),
    });
});
exports.default = sendResponse;
//# sourceMappingURL=send-response.js.map