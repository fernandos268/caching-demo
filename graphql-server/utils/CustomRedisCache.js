const { RedisCache } = require('apollo-server-cache-redis')

const CustomRedis = require('../src/context/redis/CustomRedis')

class CustomRedisCache extends RedisCache {
  constructor(options) {
    super(options)
  }

  // intercepts incoming cache key for concatenation
  async set(key, value, options = {}) {
    const cacheValue = JSON.parse(value)
    console.log('cacheValue: ', cacheValue);
    const { data } = cacheValue
    if (data.projects || data.project) {
      const newKey = key.concat('?project')
      return super.set(newKey, value, 'ex', options.ttl)
    }
    if (data.visits || data.visit) {
      const newKey = key.concat('?visit')
      return super.set(newKey, value, 'ex', options.ttl)
    }
    if (data.photos || data.photo) {
      const newKey = key.concat('?photo')
      return super.set(newKey, value, 'ex', options.ttl)
    }
  }

  async get(key) {
    // intercepts key to get the concatenated key from redis
    const redis = new CustomRedis({host: '10.110.55.101'})
    const cacheKey = await redis.getKey(key)
    return super.get(cacheKey)
  }
}

module.exports = CustomRedisCache
