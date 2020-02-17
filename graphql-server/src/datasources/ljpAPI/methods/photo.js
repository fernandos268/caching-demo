async function getPhotos(params) {
    try {
        return await this.get(`/photo`, params)
    } catch (err) {
        console.log('Error in fetching Photos: ', err)
        throw err
    }
}

async function getPhotoById(id) {
    try {
        return await this.get(`/photo/${id}`)
    } catch (err) {
        console.log('Error in fetching Photos: ', err)
        throw err
    }
}

async function createPhoto(input) {
    try {
        return await this.post(`photo`, input)
    } catch (err) {
        console.log('Error in creating photo', err)
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
    createPhoto,
    updatePhoto,
    deletePhoto
}
