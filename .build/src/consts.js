"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGGER_DISABLE_CONSOLE_INTERCEPT = exports.DYNAMO_DB_URI = exports.ENVIRONMENT = exports.AWS_REGION = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { AWS_REGION = '', ENVIRONMENT = '', DYNAMO_DB_URI = '', LOGGER_DISABLE_CONSOLE_INTERCEPT = false, } = process.env;
exports.AWS_REGION = AWS_REGION;
exports.ENVIRONMENT = ENVIRONMENT;
exports.DYNAMO_DB_URI = DYNAMO_DB_URI;
exports.LOGGER_DISABLE_CONSOLE_INTERCEPT = LOGGER_DISABLE_CONSOLE_INTERCEPT;
//# sourceMappingURL=consts.js.map