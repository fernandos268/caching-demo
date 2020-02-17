async function getProjects(params) {
    let result
    try{
        result = await this.get(`/project`, params)
    }catch(err) {
        console.log('Error in fetching projects: ', err)
        throw err
    }

    return result
}

async function getProjectById(id) {
    let result
    try{
        result = await this.get(`/project/${id}`)
    }catch(err) {
        console.log('Error in fetching projects: ', err)
        throw err
    }

    return result
}

async function createProject(input) {
    let result
    try {
        result = await this.post(`project`, input)
    } catch (err) {
        console.log('Error in creating project', err)
        throw err
    }
    return result
}

module.exports = {
    getProjects,
    getProjectById,
    createProject
}