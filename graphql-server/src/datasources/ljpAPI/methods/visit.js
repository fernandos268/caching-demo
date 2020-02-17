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

async function getVisitsByProject(project_id) {
    console.log('getVisitsByProject --> project_id', project_id)
    const result = await rethink.table('tbl_Visit').filter({ project_id }).run()
    console.log('getVisitsByProject', result)
    return result
}

module.exports = {
    getVisits,
    getVisitsByProject
}