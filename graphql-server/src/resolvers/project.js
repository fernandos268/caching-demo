module.exports = {
    Query: {
        async projects(_, { params }, { dataSources }) {
            console.log('Fetching projects....')
            return await dataSources.ljpAPI.getProjects(params);
        },
        async project(_, {id}, { dataSources }) {
            console.log(`Fetching project by id ${id}`)
            return await dataSources.ljpAPI.getProjectById(id)
        }
    },
    Mutation: {
        async createProject(_, { input }, { dataSources }) {
            console.log('Creating project.....')
            return await dataSources.ljpAPI.createProject(input)
        },
        async updateProject(_, { input }, { dataSources }) {
            console.log('Updating project....')
            return await dataSources.ljpAPI.updateProject(input)
        },
        async deleteProject(_, { id }, { dataSources }) {
            console.log(`Deleting project id ${id}`)
            return await dataSources.ljpAPI.deleteProject(id)
        }
    },
    Project: {
        async visits({ id }, { params }, { dataSources }) {
            console.log(`Fetching visits by project id ${id}`)
            return await dataSources.ljpAPI.getVisitsByProject({ id, params });
        }
    }
}
