import NodeCache from 'node-cache'
import { KEYS_CHECK_PERIOD_IN_SECONDS } from '../../consts'

type SetMethod = (key: NodeCache.Key, value: unknown, ttl?: string | number) => boolean
type GetMethod = (key: NodeCache.Key) => unknown
type DelMethod = (key: NodeCache.Key) => number

class InitNodeCache {
  cache: NodeCache

  constructor() {
    this.cache = new NodeCache({
      checkperiod: KEYS_CHECK_PERIOD_IN_SECONDS as number,
    })
  }

  set: SetMethod = (key, value, ttl) => {
    if (ttl) {
      return this.cache.set(key, value, ttl)
    }

    return this.cache.set(key, value)
  }

  get: GetMethod = (key) => this.cache.get(key)

  del: DelMethod = (key) => this.cache.del(key)
}

// eslint-disable-next-line import/prefer-default-export
export { InitNodeCache }
