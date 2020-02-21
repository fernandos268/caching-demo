const Redis = require('ioredis');
const findAnd = require('find-and')
const objTraverse = require('obj-traverse/lib/obj-traverse')
const util = require('util')
class CustomRedis extends Redis {
    constructor(options) {
        super(options)
    }
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
        stream.on('data',(keys) => {
            super.unlink(keys)
        });
        stream.on('end', function() {
        console.log('Deleted keys');
        });
    }

    updateAllCache({id, ...input}, keyword) {
        const stream = super.scanStream({match: `*${keyword}*`});
        stream.on('data', (keys) => {
            keys.forEach(async key => {
                // const cacheString = await super.get(key)
                const cacheObject = JSON.parse(await super.get(key))

                const result = findAnd.changeProps(cacheObject, {id}, input )
                await super.set(key, JSON.stringify(result), 'ex', '100')

            })
        });
        stream.on('end', function() {
        console.log('Deleted keys');
        });
    }


    // gets the concatenated key that matches the original key hash
    async getConcatenatedKey(key) {
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
