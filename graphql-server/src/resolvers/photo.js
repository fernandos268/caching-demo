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
    async photosByVisit(_, { visit_id }, { dataSources }) {
      console.log(`Fetching photos by visit id ${visit_id}....`);
      return await dataSources.ljpAPI.getPhotosByVisit(visit_id);
    }
  },
  Mutation: {
    async addPhotoToVisit(_, { input }, { dataSources }) {
      console.log('Adding Photo to Visit.....')
      await dataSources.redis.deleteAllKeys()
      return await dataSources.ljpAPI.addPhotoToVisit(input)
    },
    async updatePhoto(_, { input }, { dataSources }) {
      await dataSources.redis.deleteAllKeys()
      return await dataSources.ljpAPI.updatePhoto(input)
    },
    async deletePhoto(_, { id }, { dataSources }) {
      await dataSources.redis.deleteAllKeys()
      return await dataSources.ljpAPI.deletePhoto(id)
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
