async function getProjects(params) {
    let result
    try{
        const {
            limit,
            limitless,
            page
        } = params

        const query_string = `?limit=${limit}&page=${page}`

        result = await this.get(`/project${query_string}`)
    }catch(err) {
        console.log('Error in fetching projects: ', err)
        throw err
    }

    return result
}

module.exports = {
    getProjects
}