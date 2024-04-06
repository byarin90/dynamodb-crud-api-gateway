"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PINO_OPTIONS = void 0;
const PINO_OPTIONS = {
    level: 'info',
    customLevels: {
        final: 35,
    },
    formatters: {
        level: (label) => ({ level: label }),
    },
    hooks: {
        logMethod(inputArgs, method) {
            let string;
            let bindings;
            const arg1 = inputArgs.shift();
            if (typeof arg1 === 'object') {
                bindings = { ...arg1 };
                if (inputArgs.length === 0) {
                    string = 'no message provided';
                }
                else {
                    string = inputArgs.shift();
                }
            }
            else {
                bindings = {};
                string = `${arg1}`;
            }
            if (inputArgs.length) {
                string = `${string} ${inputArgs.map((arg) => `%s ${JSON.stringify(arg)}`).join(', ')}`;
            }
            return method.apply(this, [bindings, string]);
        },
    },
};
exports.PINO_OPTIONS = PINO_OPTIONS;
//# sourceMappingURL=pino-options.js.map