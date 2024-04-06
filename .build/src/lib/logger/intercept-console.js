"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interceptConsole = void 0;
const interceptConsole = (logger, levels = ['log', 'debug', 'info', 'warn', 'error']) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const useLogger = (level) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const log = (logger[level] ?? logger.info).bind(logger);
        return (...args) => {
            if (args.length > 0) {
                if (typeof args[0] === 'string' && typeof args[1] === 'object') {
                    log(args[1], args[0], ...args.slice(2));
                }
                else {
                    log(args[0], ...args.slice(1));
                }
            }
            else {
                log(args[0]);
            }
        };
    };
    const originals = {};
    levels.forEach((level) => {
        originals[level] = console[level]; // eslint-disable-line
        Object.assign(console, {
            [level]: useLogger(level),
        });
    });
};
exports.interceptConsole = interceptConsole;
//# sourceMappingURL=intercept-console.js.map