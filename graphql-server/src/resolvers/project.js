module.exports = {
  Query: {
    async projects(_, __, { dataSources }) {
      console.log('Fetching projects....');
      return await dataSources.ljpAPI.getProjects();
    }
  }
};
