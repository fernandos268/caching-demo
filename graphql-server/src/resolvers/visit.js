
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
        async visitsByProject(_, { project_id }, { dataSources }) {
            console.log('Fetchingu visitu by id...')
            return await dataSources.ljpAPI.getVisitsByProject(project_id)
        }
    },
    Mutation: {
        async createVisit(_, { input }, { dataSources }) {
            console.log('Creating visit.....')
            return await dataSources.ljpAPI.createVisit(input)
        },
        async updateVisit(_, { input }, { dataSources }) {
            console.log('Updating visitu....')
            return await dataSources.ljpAPI.updateVisit(input)
        },
        async deleteVisit(_, { id }, { dataSources }) {
            console.log('Deleting visitu....')
            return await dataSources.ljpAPI.deleteVisit(id)
        }
    },
    Visit: {
        photos(parent, args, ctx) {

        },
        async project(parent, args, { dataSources }) {
            const { project_id } = parent
            const result = await dataSources.ljpAPI.getProjectById(project_id)
            console.log('Visit --> project', result)
            return result
        },
    }
}
