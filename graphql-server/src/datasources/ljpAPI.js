const {
    DB_NAME,
    DB_HOST,
    DB_PORT
} = config

const r = require('rethinkdbdash')({ servers: [{ host: DB_HOST, port: DB_PORT }], db: DB_NAME });

class LJPAPI {
    async getProjects() {
        const result = await r.table('tbl_Project').run()

        return result
    }
}

module.exports = LJPAPI
