module.exports = {
    Query: {
        async photos(_, __, {dataSources, r}) {
            console.log('Fetching photos....')
            return await dataSources.ljpAPI.getPhotos()
        }
    }
}
