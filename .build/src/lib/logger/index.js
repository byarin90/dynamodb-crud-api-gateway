"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const pino_options_1 = require("./pino-options");
const context_1 = require("./context");
const intercept_console_1 = require("./intercept-console");
const consts_1 = require("../../consts");
class Logger {
    constructor() {
        this.context = new context_1.Context();
        this.logger = (0, pino_1.default)(pino_options_1.PINO_OPTIONS);
    }
    getLogger() { return this.logger; }
    addExecutionContext(context = {}) {
        this.context.addExecutionContext(context);
    }
    getExecutionContext() {
        return this.context.getExecutionContext();
    }
    trace(msg, ...args) { this.logger.trace(args.reduce((curr, acc) => ({ ...acc, ...curr }), { ...this.getExecutionContext() }), msg); }
    debug(msg, ...args) { this.logger.debug(args.reduce((curr, acc) => ({ ...acc, ...curr }), { ...this.getExecutionContext() }), msg); }
    info(msg, ...args) { this.logger.info(args.reduce((curr, acc) => ({ ...acc, ...curr }), { ...this.getExecutionContext() }), msg); }
    warn(msg, ...args) { this.logger.warn(args.reduce((curr, acc) => ({ ...acc, ...curr }), { ...this.getExecutionContext() }), msg); }
    error(msg, ...args) { this.logger.error(args.reduce((curr, acc) => ({ ...acc, ...curr }), { ...this.getExecutionContext() }), msg); }
    fatal(msg, ...args) { this.logger.fatal(args.reduce((curr, acc) => ({ ...acc, ...curr }), { ...this.getExecutionContext() }), msg); }
    setLevel(level) { this.logger.level = level; }
    getLevel() { return this.logger.level; }
}
exports.Logger = Logger;
if (!consts_1.LOGGER_DISABLE_CONSOLE_INTERCEPT)
    (0, intercept_console_1.interceptConsole)((new Logger()).getLogger());
const logger = new Logger();
exports.logger = logger;
//# sourceMappingURL=index.js.map