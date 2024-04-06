"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const uuid_1 = require("uuid");
const async_hooks_1 = __importDefault(require("async_hooks"));
class Context {
    constructor() {
        // eslint-disable-next-line class-methods-use-this
        this.generateId = () => (0, uuid_1.v4)();
        this.storeExists = (asyncId) => this.store.has(asyncId);
        this.setStore = (asyncId, data) => this.store.set(asyncId, data);
        this.getStore = (asyncId) => this.store.get(asyncId);
        this.deleteStore = (asyncId) => this.store.delete(asyncId);
        this.addExecutionContext = (context = {}) => {
            const execAsyncId = async_hooks_1.default.executionAsyncId();
            const current = this.getStore(execAsyncId) || { requestId: this.generateId() };
            this.setStore(execAsyncId, { ...current, ...context });
        };
        this.getExecutionContext = () => this.getStore(async_hooks_1.default.executionAsyncId());
        this.store = new Map();
        this.asyncHook = (async_hooks_1.default.createHook({
            init: (asyncId, _, triggerAsyncId) => {
                if (this.storeExists(triggerAsyncId)) {
                    this.setStore(asyncId, this.getStore(triggerAsyncId));
                }
            },
            destroy: (asyncId) => {
                if (this.storeExists(asyncId)) {
                    this.deleteStore(asyncId);
                }
            },
        })).enable();
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map