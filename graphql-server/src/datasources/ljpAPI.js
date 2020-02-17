const {
    DB_NAME,
    DB_HOST,
    DB_PORT
} = config

const rethink = require('rethinkdbdash')({ servers: [{ host: DB_HOST, port: DB_PORT }], db: DB_NAME, timeout: 10000 });

module.exports = class ljpAPI {
    async getProjects() {
        const result = await rethink.table('tbl_Project').run()

        return result
    }

    async getVisits() {
        const result = await rethink.table('tbl_Visit').run()
        console.log('getVisits', result)
        return result
    }

    async getVisitsByProject(project_id) {
        console.log('getVisitsByProject --> project_id', project_id)
        const result = await rethink.table('tbl_Visit').filter({ project_id }).run()
        console.log('getVisitsByProject', result)
        return result
    }

    async getPhotos() {
        let result
        try {
            result = await rethink.table('tbl_Photo').run()
        } catch (err) {
            console.log('Error in getting photos', err)
            throw err
        }
        return result
    }

    async getPhotosByVisit(visit_id) {
        let result
        try {
            result = await rethink.table('tbl_Photo').filter({ visit_id }).run()
        } catch (err) {
            console.log('Error in getting photos by Visit', err)
        }
        return result
    }
}
