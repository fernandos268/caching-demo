const { RedisCache } = require('apollo-server-cache-redis')

class CustomRedisCache extends RedisCache {
  async set(key, value, options = {}) {
    const cacheValue = JSON.parse(value)
    const { data } = cacheValue
    if(data.projects || data.project) {
      const newKey = key.concat('?project')
      return super.set(newKey, value, 'ex', options.ttl)
    }
    if(data.visits || data.visit) {
      const newKey = key.concat('?visit')
      return super.set(newKey, value, 'ex', options.ttl)
    }
    if(data.photos || data.photo) {
      const newKey = key.concat('?photo')
      return super.set(newKey, value, 'ex', options.ttl)
    }
  }
}

module.exports = CustomRedisCache