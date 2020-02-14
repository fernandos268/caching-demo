const {
    DB_NAME,
    DB_HOST,
    DB_PORT
} = config

const r = require('rethinkdbdash')({ servers: [{ host: DB_HOST, port: DB_PORT, timeout: 10000 }], db: DB_NAME });

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

    async getPhotos() {
        let result
        try {
            result = await r.table('tbl_Photo').run()
        } catch (err) {
            console.log('Error in getting photos', err)
            throw err
        }
        return result
    }

    async getPhotosByVisit(visit_id) {
        let result
        try {
            result = await r.table('tbl_Photo').filter({visit_id}).run()
        } catch (err) {
            console.log('Error in getting photos by Visit', err)
        }
        return result
    }
}

module.exports = LJPAPI
