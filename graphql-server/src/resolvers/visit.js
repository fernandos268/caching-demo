
module.exports = {
    Query: {
        async visits(_, {params}, { dataSources }) {
            console.log('Fetchingu ...')
            return await dataSources.ljpAPI.getVisits(params)
        },
        async visitsByProject(_, { project_id }, { dataSources }) {
            console.log('Fetchingu ...')
            return await dataSources.ljpAPI.getVisitsByProject(project_id)
        }
    },
    Mutation: {
        async createVisit(_, { input }, { dataSources }) {

        },
        async updateVisit(_, { input }, { dataSources }) {

        },
        async deleteVisit(_, { input }, { dataSources }) {

        }
    },
    Visit: {
        photos(parent, args, ctx) {

        }
    }
}
