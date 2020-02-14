const {
    DB_NAME,
    DB_HOST,
    DB_PORT
} = config

const r = require('rethinkdbdash')({ servers: [{ host: DB_HOST, port: DB_PORT }], db: DB_NAME });

module.exports = class ljpAPI {
    async getProjects() {
        const result = await r.table('tbl_Project').run()

        return result
    }

    async getVisits() {
        return await r.table('tbl_Visit').run()
    }

    async getVisitsByProject(project_id) {
        console.log('getVisitsByProject --> project_id', project_id)
        const result = await r.table('tbl_Visit').filter({ project_id }).run()
        console.log('getVisitsByProject', result)
        return result
    }
}
