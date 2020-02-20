const Redis = require('ioredis');

class CustomRedis {
    constructor(options) {
        const client = new Redis(options)
        this.client = client
        // this.client(options)
    }
    // deletes all keys in redis with keyword fqc
    deleteAllKeys() {
        const stream = this.client.scanStream({match: `fqc:*`});
        stream.on('data', (keys) => {
            this.client.unlink(keys)
        });
        stream.on('end', function() {
        console.log('done');
        });
    }

    // deletes all keys in redis by keyword
    deleteAllKeysByKeyword(keyword) {
        const stream = this.client.scanStream({match: `*${keyword}*`});
        stream.on('data', (keys) => {
            this.client.unlink(keys)
        });
        stream.on('end', function() {
        console.log('Deleted keys');
        });
    }

    // gets the concatenated key that matches the original key hash
    async getKey(key) {
        return new Promise(async (resolve, reject) => {
            const keys = await this.client.keys(`${key}*`)
            if(keys.length) {
                keys.forEach(cacheKey => {
                    if(cacheKey.includes(key)) {
                        resolve(cacheKey)
                    }
                })
            }
            resolve(key)
        } )
    }
}

module.exports = CustomRedis;
