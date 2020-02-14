
module.exports = {
    Query: {
        async visits(_, __, { dataSources }) {
            console.log('Fetchingu ...')
            return await dataSources.ljpAPI.getVisits()
        },
        async visitsByProject(_, { project_id }, { dataSources }) {
            console.log('Fetchingu ...')
            return await dataSources.ljpAPI.getVisitsByProject(project_id)
        }
    }
}
