module.exports = {
    Query: {
        async projects(_, { params }, { dataSources }) {
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
        async visits(project, args, { dataSources }) {
            return []
        },
        async photos(project, args, { dataSources }) {
            return []
        }
    }
}
