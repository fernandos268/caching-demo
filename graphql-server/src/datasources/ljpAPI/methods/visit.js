async function getVisits(params) {
    let result
    try {
        result = await this.get(`/visit`, params)

    } catch(err) {
        console.log('Error in getting visits:', err)
        throw err
    }

    return result
}

async function getVisitsByProject({id, params}) {
    let result
    try {
        result = await this.get(`/project/${id}/visits`, params)
    } catch(err) {
        console.log('Error in getting visits by projects', err)
        throw err
    }
    return result
}

module.exports = {
    getVisits,
    getVisitsByProject
}