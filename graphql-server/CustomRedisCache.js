const { RedisCache } = require('apollo-server-cache-redis')

const CustomRedis = require('./src/datasources/redis/CustomRedis')

class CustomRedisCache extends RedisCache {

  // intercepts incoming cache key for concatenation
  async set(key, value, options = {}) {
    const cacheValue = JSON.parse(value)
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
    const redis = new CustomRedis()
    const cacheKey = await redis.getKey(key)
    const value = await super.get(cacheKey)
    console.log('get(key)', value)
    return value
  }
}

module.exports = CustomRedisCache
