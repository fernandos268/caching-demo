async function getVisits(params) {
    try {
        return await this.get(`/visit`, params)

    } catch(err) {
        console.log('Error in getting visits:', err)
        throw err
    }
}

async function getVisitsByProject({id, params}) {
    try {
        return await this.get(`/project/${id}/visits`, params)
    } catch(err) {
        console.log('Error in getting visits by projects', err)
        throw err
    }
}


module.exports = {
    getVisits,
    getVisitsByProject
}