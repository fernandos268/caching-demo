const { RESTDataSource } = require('apollo-datasource-rest')
module.exports = class ljpAPI extends RESTDataSource {
    constructor() {
        super()
        this.baseURL = 'http://localhost:4000'
    }

    async getProjects(params) {
        let result
        try{
            const {
                limit,
                limitless,
                page
            } = params

            const query_string = `?limit=${limit}&page=${page}`

            result = await this.get(`/project${query_string}`)
        }catch(err) {
            console.log('Error in fetching projects: ', err)
            throw err
        }

        return result
    }

    async getVisits(params) {
        let result
        try {
            const {
                limit,
                limitless,
                page
            } = params

            const query_string = `?limit=${limit}&page=${page}`
            result = await this.get(`/visit${query_string}`)

        } catch(err) {
            console.log('Error in getting visits:', err)
            throw err
        }

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
