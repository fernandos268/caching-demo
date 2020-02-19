const redis = require("ioredis")

const {
    REDIS_PORT,
    REDIS_HOST
} = config


const client = redis.createClient({
    port: REDIS_PORT,
    host: REDIS_HOST
})

module.exports = {
    async set(key, value, maxAge) {
        return await client.set(key, value, 'ex', maxAge)
    },

    async get(key) {
        console.log('CACHE --> set', key)
    },

    async check(key) {
        if (key) {
            console.log('CACHE --> set:', key)
            const val = await client.get(key)
            console.log('val --> ', val)
        }

        return false
    },
}
