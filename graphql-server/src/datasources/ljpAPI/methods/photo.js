async function getPhotos(params) {
    let result
    try{
        result = await this.get(`/photo`, params)
    }catch(err) {
        console.log('Error in fetching photos: ', err)
        throw err
    }

    return result
}

async function getPhotosByVisit(visit_id) {
    let result
    try {
        result = await rethink.table('tbl_Photo').filter({ visit_id }).run()
    } catch (err) {
        console.log('Error in getting photos by Visit', err)
    }
    return result
}

module.exports = {
    getPhotos,
    getPhotosByVisit
}