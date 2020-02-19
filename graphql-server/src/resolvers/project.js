module.exports = {
    Query: {
        async projects(_, { params }, { dataSources, cache, cacheFunctions }) {
            const isCached = await cacheFunctions.check('projects')
            if (isCached) {
                console.log({ isCached })
            }
            const result = await dataSources.ljpAPI.getProjects(params)
            await cacheFunctions.set('projects', JSON.parse(result), 100)
            return result
        },
        async project(_, { id }, { dataSources }) {
            console.log(`Fetching project by id ${id}`)
            return await dataSources.ljpAPI.getProjectById(id)
        }
    },
    Mutation: {
        async createProject(_, { input }, { dataSources }) {
            console.log('Creating project.....')
            await dataSources.redis.deleteAllKeysByKeyword('project')
            return await dataSources.ljpAPI.createProject(input)
        },
        async updateProject(_, { input }, { dataSources }) {
            console.log('Updating project....')
            await dataSources.redis.deleteAllKeysByKeyword('project')
            return await dataSources.ljpAPI.updateProject(input)
        },
        async deleteProject(_, { id }, { dataSources }) {
            console.log(`Deleting project id ${id}`)
            await dataSources.redis.deleteAllKeysByKeyword('project')
            return await dataSources.ljpAPI.deleteProject(id)
        }
    },
    Project: {
        async visits({ id }, { params }, { dataSources }) {
            console.log(`Fetching visits by project id ${id}`)
            return await dataSources.ljpAPI.getVisitsByProject({ project_id: id, params });
        }
    }
}
