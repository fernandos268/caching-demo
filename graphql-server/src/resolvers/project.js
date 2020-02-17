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
        async visits(project, args, { dataSources }) {
            console.log("TCL: visits -> project", project)
            return []
        }
    }
}
