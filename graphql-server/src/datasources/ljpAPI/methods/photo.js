async function getPhotos(params) {
    try {
        console.log('getPhotos', params);
        const result = await this.get(`/photo`, params)
        return result
    } catch (err) {
        console.log('Error in fetching Photos: ', err)
        throw err
    }
}

async function getPhotoById(id) {
    try {
        return this.photosLoader.load(id)
    } catch (err) {
        console.log('Error in fetching Photos: ', err)
        throw err
    }
}

async function addPhotoToVisit(input) {
    try {
        return await this.post(`photo`, input)
    } catch (err) {
        console.log('Error in creating photo', err)
        throw err
    }
}

async function getPhotosByVisit(args) {
    const { visit_id, params } = args
    try {
        return await this.get(`visit/${visit_id}/photos`, params)
    } catch (err) {
        console.log('Error in fetching Photos: ', err)
        throw err
    }
}

async function updatePhoto(input) {
    const { id } = input
    try {
        return await this.put(`photo/${id}`, input)
    } catch (err) {
        console.log('Error in updating photo', err)
        throw err
    }
}

async function deletePhoto(id) {
    try {
        return await this.delete(`photo/${id}`)
    } catch (err) {
        console.log('Error in deleting photo', err)
        throw err
    }
}


module.exports = {
    getPhotos,
    getPhotoById,
    getPhotosByVisit,
    addPhotoToVisit,
    updatePhoto,
    deletePhoto
}
