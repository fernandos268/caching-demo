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

    async getVisits() {
        const result = await r.table('tbl_Visit').run()

        return result
    }

    async getVisitsByProject(project_id) {
        const result = await r.table('tbl_Visit').filter({ project_id }).run()

        return result
    }
}

module.exports = LJPAPI
