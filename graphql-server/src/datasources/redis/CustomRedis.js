const Redis = require('ioredis');

class CustomRedis extends Redis {

    deleteAllKeys() {
        const stream = super.scanStream({match: `fqc:*`});
        stream.on('data', (keys) => {
            super.unlink(keys)
        });
        stream.on('end', function() {
        console.log('done');
        });
    }
}

module.exports = CustomRedis;
