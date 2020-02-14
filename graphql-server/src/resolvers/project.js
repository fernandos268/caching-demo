module.exports = {
    Query: {
        async projects(_, __, { dataSources, r }) {
            console.log('Fetching projects....')
            return await dataSources.ljpAPI.getProjects()
        }
    }
}
