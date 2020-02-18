module.exports = {
  Query: {
    async photos(_, {params}, { dataSources }) {
      console.log('Fetching photos....');
      return await dataSources.ljpAPI.getPhotos(params);
    },
    async photo(_, {id}, { dataSources }) {
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

    },
    async updatePhoto(_, { input }, { dataSources }) {

    },
    async deletePhoto(_, { input }, { dataSources }) {

    }
  }
};
