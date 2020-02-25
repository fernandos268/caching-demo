module.exports = {
  Query: {
    async photos(_, { params }, { dataSources }) {
      console.log('Fetching photos....');
      return await dataSources.ljpAPI.getPhotos(params);
    },
    async photo(_, { id }, { dataSources }) {
      console.log(`Fetching photo by id ${id}`)
      return await dataSources.ljpAPI.getPhotoById(id)
    },
    async photosByVisit(_, { visit_id, params }, { dataSources }) {
      console.log(`Fetching photos by visit id ${visit_id}....`);
      return await dataSources.ljpAPI.getPhotosByVisit({ visit_id, params });
    }
  },
  Mutation: {
    async addPhotoToVisit(_, { input }, { dataSources, redis }) {
      console.log('Adding Photo to Visit.....')
      redis.deleteAllKeysByKeyword('photo')
      return await dataSources.ljpAPI.addPhotoToVisit(input)
    },
    async updatePhoto(_, { input }, { dataSources, redis }) {
      console.log('Updating photo....')
      // const result = await dataSources.ljpAPI.updatePhoto(input)
      // if (result) {
      //   await redis.updateAllCache(input, 'photo')
      // }
      // return result

      const origin_user_id = uuid()

      kafka.produce({
        topic: 'cachedemo-mutation',
        operation: 'update',
        entity: 'photo',
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
    async deletePhoto(_, { id }, { dataSources, redis, kafka }) {
      console.log(`Deleting photo id ${id}`)
      //   const result = await dataSources.ljpAPI.deletePhoto(id)
      //   if (result) {
      //     redis.deleteObjectInCache(id, 'photo')
      // }
      // return result

      const origin_user_id = uuid()

      kafka.produce({
        topic: 'cachedemo-mutation',
        operation: 'delete',
        entity: 'photo',
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
  Photo: {
    async visit(parent, args, { dataSources }) {
      const { visit_id } = parent
      return await dataSources.ljpAPI.getVisitById(visit_id)
    },
    async project(parent, args, { dataSources }) {
      const { project_id } = parent
      return await dataSources.ljpAPI.getProjectById(project_id)
    }
  }
};
