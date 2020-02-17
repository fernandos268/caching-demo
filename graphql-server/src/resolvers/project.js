module.exports = {
    Query: {
        async projects(_, __, { dataSources }) {
            console.log('Fetching projects....');
            return await dataSources.ljpAPI.getProjects();
        }
    },
    Mutation: {
        async createProject(_, { input }, { dataSources }) {

        },
        async updateProject(_, { input }, { dataSources }) {

        },
        async deleteProject(_, { input }, { dataSources }) {

        }
    }
};
