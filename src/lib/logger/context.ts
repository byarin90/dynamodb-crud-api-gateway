import { v4 as uuid } from 'uuid'
import asyncHooks from 'async_hooks'

interface ContextData extends Record<string, unknown> {
  requestId?: string
}

class Context {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Map<any, any>

  asyncHook: asyncHooks.AsyncHook

  constructor() {
    this.store = new Map()

    this.asyncHook = (asyncHooks.createHook({
      init: (asyncId: number, _: string, triggerAsyncId: number) => {
        if (this.storeExists(triggerAsyncId)) {
          this.setStore(asyncId, this.getStore(triggerAsyncId))
        }
      },
      destroy: (asyncId: number) => {
        if (this.storeExists(asyncId)) {
          this.deleteStore(asyncId)
        }
      },
    })).enable()
  }

  // eslint-disable-next-line class-methods-use-this
  generateId: () => string = () => uuid()

  storeExists: (asyncId: number) => boolean = (asyncId) => this.store.has(asyncId)

  setStore: (asyncId: number, data: ContextData) => Map<unknown, unknown> = (asyncId, data) => this.store.set(asyncId, data)

  getStore: (asyncId: number) => ContextData = (asyncId) => this.store.get(asyncId)

  deleteStore: (asyncId: number) => boolean = (asyncId) => this.store.delete(asyncId)

  addExecutionContext: (context: ContextData) => void = (context = {}) => {
    const execAsyncId = asyncHooks.executionAsyncId()
    const current = this.getStore(execAsyncId) || { requestId: this.generateId() }

    this.setStore(execAsyncId, { ...current, ...context })
  }

  getExecutionContext: () => ContextData = () => this.getStore(asyncHooks.executionAsyncId())
}

// eslint-disable-next-line import/prefer-default-export
export { Context, ContextData }
