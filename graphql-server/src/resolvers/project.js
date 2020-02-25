const util = require('util')
const uuid = require('uuid/v4')

module.exports = {
    Query: {
        async projects(_, { params }, { dataSources, kafka }, info) {
            return await dataSources.ljpAPI.getProjects(params)
        },
        async project(_, { id }, { dataSources }) {
            console.log(`Fetching project by id ${id}`)
            return await dataSources.ljpAPI.getProjectById(id)
        }
    },
    Mutation: {
        async createProject(_, { fields }, { dataSources, redis, kafka }) {
            console.log('Creating project.....')
            redis.deleteAllKeysByKeyword('project')
            return await dataSources.ljpAPI.createProject(fields)

            // const origin_user_id = uuid()

            // kafka.produce({
            //     topic: 'cachedemo-mutation',
            //     operation: 'create',
            //     entity: 'project',
            //     origin_user_id,
            //     input
            // })

            // return null
        },
        async updateProject(_, { input }, { dataSources, redis, kafka }, info) {
            // console.log(util.inspect(info.fieldNodes.find(({selectionSet}) => selectionSet).selectionSet, false, null, true))
            // console.log('Updating project....')
            // // update the database
            // const result = await dataSources.ljpAPI.updateProject(input)
            // // update the cache
            // if (result) {
            //     await redis.updateAllCache(input, 'project')
            // }
            // return result

            const origin_user_id = uuid()

            kafka.produce({
                topic: 'cachedemo-mutation',
                operation: 'update',
                entity: 'project',
                origin_user_id,
                input
            })

            return new Promise((resolve, reject) => {
                kafka.consumer.on('message', message => {
                    const {
                        topic,
                        value
                    } = message

                    const parsed_message = JSON.parse(value)

                    if (topic === 'cachedemo-mutation-response' && parsed_message.origin_user_id === origin_user_id) {
                        console.log('cachedemo-mutation-response', parsed_message);
                        const { updatedNode, success } = parsed_message
                        if (!!success) {
                            resolve(updatedNode)
                        }
                        reject()
                    }
                })
            })
        },
        async deleteProject(_, { id }, { dataSources, redis, kafka }) {
            // console.log(`Deleting project id ${id}`)
            // const result = await dataSources.ljpAPI.deleteProject(id)
            // if (result) {
            //     redis.deleteObjectInCache(id, 'project')
            // }
            // return result

            const origin_user_id = uuid()

            kafka.produce({
                topic: 'cachedemo-mutation',
                operation: 'delete',
                entity: 'project',
                origin_user_id,
                input: { id }
            })

            return new Promise((resolve, reject) => {
                kafka.consumer.on('message', message => {
                    const {
                        topic,
                        value
                    } = message

                    const parsed_message = JSON.parse(value)

                    if (topic === 'cachedemo-mutation-response' && parsed_message.origin_user_id === origin_user_id) {
                        console.log('cachedemo-mutation-response', parsed_message);
                        const { deletedId, success } = parsed_message
                        if (!!success) {
                            resolve(deletedId)
                        }
                        reject()
                    }
                })
            })
        }
    },
    Project: {
        async visits({ id }, { params }, { dataSources }) {
            console.log(`Fetching visits by project id ${id}`)
            return await dataSources.ljpAPI.getVisitsByProject({ project_id: id, params });
        }
    }
}
