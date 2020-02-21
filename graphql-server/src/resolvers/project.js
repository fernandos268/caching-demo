const util = require('util')

module.exports = {
    Query: {
        async projects(_, { params }, { dataSources, cache, cacheFunctions }, info) {
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
            // get the field to be updated
            console.log("TCL: updateProject -> input", input)
            console.log('Updating project....')
            // redis.deleteAllKeysByKeyword('project')

            // update the database
            const result = await dataSources.ljpAPI.updateProject(input)
            console.log("TCL: updateProject -> result", result)

            // update the cache
            if(result) {
                await redis.updateAllCache(input, 'project')
            }
            return result
        },
        async deleteProject(_, { id }, { dataSources, redis }) {
            console.log(`Deleting project id ${id}`)
            redis.deleteAllKeysByKeyword('project')
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
