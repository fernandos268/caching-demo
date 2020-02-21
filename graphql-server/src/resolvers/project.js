const util = require('util')

module.exports = {
    Query: {
        async projects(_, { params }, { dataSources, cache, cacheFunctions }, info) {
            console.log(info.cacheControl);
            return await dataSources.ljpAPI.getProjects(params)
        },
        async project(_, { id }, { dataSources }) {
            console.log(`Fetching project by id ${id}`)
            return await dataSources.ljpAPI.getProjectById(id)
        }
    },
    Mutation: {
        async createProject(_, { input }, { dataSources, redis }) {
            console.log('Creating project.....')
           redis.deleteAllKeysByKeyword('project')
            return await dataSources.ljpAPI.createProject(input)
        },
        async updateProject(_, { input }, { dataSources, redis }, info) {
            // console.log(util.inspect(info.fieldNodes.find(({selectionSet}) => selectionSet).selectionSet, false, null, true))
            console.log('Updating project....')
            // update the database
            const result = await dataSources.ljpAPI.updateProject(input)
            // update the cache
            if(result) {
                await redis.updateAllCache(input, 'project')
            }
            return result
        },
        async deleteProject(_, { id }, { dataSources, redis }) {
            console.log(`Deleting project id ${id}`)
            const result = await dataSources.ljpAPI.deleteProject(id)
            if (result) {
                redis.deleteObjectInCache(id, 'project')
            }
            return result
        }
    },
    Project: {
        async visits({ id }, { params }, { dataSources }) {
            console.log(`Fetching visits by project id ${id}`)
            return await dataSources.ljpAPI.getVisitsByProject({ project_id: id, params });
        }
    }
}
