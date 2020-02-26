
module.exports = {
    Query: {
        async visits(_, { params }, { dataSources }) {
            console.log('Fetchingu visitu ...')
            return await dataSources.ljpAPI.getVisits(params)
        },
        async visit(_, { id }, { dataSources }) {
            console.log(`Fetching visit by id ${id}`)
            return await dataSources.ljpAPI.getVisitById(id)
        },
        async visitsByProject(_, args, { dataSources }) {
            console.log('Fetchingu visitu by id...', args)
            return await dataSources.ljpAPI.getVisitsByProject(args)
        }
    },
    Mutation: {
        async createVisit(_, { input }, { dataSources, redis }) {
            console.log('Creating visit.....')
            redis.deleteAllKeysByKeyword('visit')
            return await dataSources.ljpAPI.createVisit(input)
        },
        async updateVisit(_, { input }, { dataSources, redis, kafka }) {
            console.log('Updating visitu....')
            // const result = await dataSources.ljpAPI.updateVisit(input)
            // if(result) {
            //     await redis.updateAllCache(input, 'visit')
            // }
            // return result

            const origin_user_id = uuid()

            kafka.produce({
                topic: 'cachedemo-mutation',
                operation: 'update',
                entity: 'visit',
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
        async deleteVisit(_, { id }, { dataSources, redis, kafka }) {
            console.log('Deleting visitu....')
            // const result = await dataSources.ljpAPI.deleteVisit(id)
            // if (result) {
            //     redis.deleteObjectInCache(id, 'visit')
            // }
            // return result

            const origin_user_id = uuid()

            kafka.produce({
                topic: 'cachedemo-mutation',
                operation: 'delete',
                entity: 'visit',
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
                        const { updatedNode, success, error } = parsed_message
                        resolve({
                            isSuccess: success,
                            updatedNode,
                            error
                        })

                    }
                })
            })

        }
    },
    Visit: {
        async photos(parent, { params }, { dataSources }, info) {
            const { id } = parent
            return await dataSources.ljpAPI.getPhotosByVisit({ visit_id: id, ...params })
        },
        async project(parent, args, { dataSources }) {
            const { project_id } = parent
            return await dataSources.ljpAPI.getProjectById(project_id)
        },
    }
}
