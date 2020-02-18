module.exports = {
  Query: {
    async photos(_, { params }, { dataSources }) {
      console.log('Fetching photos....');
      return await dataSources.ljpAPI.getPhotos(params);
    },
    async photosByVisit(_, { visit_id }, { dataSources }) {
      console.log(`Fetching photos by visit id ${visit_id}....`);
      return await dataSources.ljpAPI.getPhotosByVisit(visit_id);
    }
  },
  Mutation: {
    async addPhotoToVisit(_, { input }, { dataSources }) {
      console.log('Adding Photo to Visit.....')
      return await dataSources.ljpAPI.addPhotoToVisit(input)
    },
    async updatePhoto(_, { input }, { dataSources }) {
      return await dataSources.ljpAPI.updatePhoto(input)
    },
    async deletePhoto(_, { id }, { dataSources }) {
      return await dataSources.ljpAPI.deletePhoto(id)
    }
  }
};
