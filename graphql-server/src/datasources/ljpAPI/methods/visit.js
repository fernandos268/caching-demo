async function getVisits(params) {
    let result
    try {
        const {
            limit,
            limitless,
            page
        } = params

        const query_string = `?limit=${limit}&page=${page}`
        result = await this.get(`/visit${query_string}`)

    } catch(err) {
        console.log('Error in getting visits:', err)
        throw err
    }

    return result
}

async function getVisitsByProject({id, params}) {
    let result
    try {
        const {
            limit,
            limitless,
            page
        } = params

        const query_string = `?limit=${limit}&page=${page}`
        result = await this.get(`/project/${id}/visits${query_string}`)


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