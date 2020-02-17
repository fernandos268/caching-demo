module.exports = {
    Query: {
        async projects(_, { params }, { dataSources }) {
            console.log('Fetching projects....');
            return await dataSources.ljpAPI.getProjects(params);


        }
    },
    Mutation: {
        async createProject(_, { input }, { dataSources }) {

        },
        async updateProject(_, { input }, { dataSources }) {

        },
        async deleteProject(_, { input }, { dataSources }) {

        }
    },
    Project: {
        async visits({id}, __, { dataSources }, {variableValues: {params}}) {
            console.log(`Fetching visits by project id ${id}`)
            return await dataSources.ljpAPI.getVisitsByProject({id, params});
        }
    }
}
