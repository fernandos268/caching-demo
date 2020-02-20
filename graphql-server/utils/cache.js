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
        const val = JSON.stringify(value)
        return await client.set(key, val, 'ex', maxAge)
    },

    async get(key, params) {
        const {
            limit,
            page,
            limitless
        } = params

        if (key) {
            console.log('CACHE --> set:', key)
            const data = await client.get(key)
            const parsed_data = JSON.parse(data)
            console.log('parsed_data: ', parsed_data);
            if (data) {
                if ((parsed_data.length - 1) <= limit) {
                    return parsed_data
                }

                const limited_data = [...parsed_data].slice(0, (limit + 1))
                return limited_data
            }
        }
    },

    async remove(key) {
        if (key) {
            return await client.del('key')
        }
    },

    async check(key, params) {
        console.log('params: ', params);
        const { limit } = params
        if (key) {
            const data = await client.get(key)
            const parsed_data = JSON.parse(data)
            if (data && (parsed_data.length - 1) > limit) {
                return false
            }
            return true
        }

        return false
    },
}
