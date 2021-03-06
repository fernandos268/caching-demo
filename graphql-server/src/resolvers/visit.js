
module.exports = {
    Query: {
        async visits(_, { params }, { dataSources }) {
            console.log('Fetchingu visitu ...')
            return await dataSources.ljpAPI.getVisits(params)
        },
        async visit(_, { id }, { dataSources }) {
            console.log(`Fetching visit by id ${id}`)
            return await dataSources.ljpAPI.getVisitById(id)
        },
        async visitsByProject(_, args, { dataSources }) {
            console.log('Fetchingu visitu by id...', args)
            return await dataSources.ljpAPI.getVisitsByProject(args)
        }
    },
    Mutation: {
        async createVisit(_, { input }, { dataSources, redis }) {
            console.log('Creating visit.....')
            redis.deleteAllKeysByKeyword('visit')
            return await dataSources.ljpAPI.createVisit(input)
        },
        async updateVisit(_, { input }, { dataSources, redis }) {
            console.log('Updating visitu....')
            redis.deleteAllKeysByKeyword('visit')
            return await dataSources.ljpAPI.updateVisit(input)
        },
        async deleteVisit(_, { id }, { dataSources, redis }) {
            console.log('Deleting visitu....')
            redis.deleteAllKeysByKeyword('visit')
            return await dataSources.ljpAPI.deleteVisit(id)
        }
    },
    Visit: {
        async photos(parent, { params }, { dataSources }, info) {
            const { id } = parent
            return await dataSources.ljpAPI.getPhotosByVisit({ visit_id: id, ...params })
        },
        async project(parent, args, { dataSources }) {
            const { project_id } = parent
            return await dataSources.ljpAPI.getProjectById(project_id)
        },
    }
}
