const { RedisCache } = require('apollo-server-cache-redis')

const CustomRedis = require('../src/context/redis/CustomRedis')
const { generateDataToString } = require('./generateDataToString')
class CustomRedisCache extends RedisCache {
  constructor(options) {
    super(options)
  }

  // intercepts incoming cache key for concatenation
  async set(key, value, options = {}) {
    const cacheValue = JSON.parse(value)
    const { data } = cacheValue
    const concatString = generateDataToString(data)
    const newKey = `${key}:${JSON.stringify(concatString)}`
    return super.set(newKey, value, 'ex', options.ttl)
  }

  async get(key) {
    // intercepts key to get the concatenated key from redis
    const redis = new CustomRedis({host: '10.110.55.101'})
    const cacheKey = await redis.getConcatenatedKey(key)
    return super.get(cacheKey)
  }
}



module.exports = CustomRedisCache
