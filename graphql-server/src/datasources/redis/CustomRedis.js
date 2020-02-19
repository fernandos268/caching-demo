const Redis = require('ioredis');

class CustomRedis extends Redis {

    // deletes all keys in redis with keyword fqc
    deleteAllKeys() {
        const stream = super.scanStream({match: `fqc:*`});
        stream.on('data', (keys) => {
            super.unlink(keys)
        });
        stream.on('end', function() {
        console.log('done');
        });
    }

    // deletes all keys in redis by keyword
    deleteAllKeysByKeyword(keyword) {
        const stream = super.scanStream({match: `*${keyword}*`});
        stream.on('data', (keys) => {
            super.unlink(keys)
        });
        stream.on('end', function() {
        console.log('done');
        });
    }

    // gets the concatenated key that matches the original key hash
    async getKey(key) {
        return new Promise(async (resolve, reject) => {
            const keys = await super.keys(`${key}*`)
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
