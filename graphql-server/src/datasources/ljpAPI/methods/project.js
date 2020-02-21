async function getProjects(params) {
    try {
        return await this.get(`/project`, params)
    } catch (err) {
        console.log('Error in fetching projects: ', err)
        throw err
    }
}

async function getProjectById(id) {
    try {
        return this.projectsLoader.load(id)
    } catch (err) {
        console.log('Error in fetching projects: ', err)
        throw err
    }
}

async function createProject(input) {
    try {
        return await this.post(`project`, input)
    } catch (err) {
        console.log('Error in creating project', err)
        throw err
    }
}

async function updateProject({ id, ...input }) {
    try {
        return await this.put(`project/${id}`, input)
    } catch (err) {
        console.log('Error in updating project', err)
        throw err
    }
}

async function deleteProject(id) {
    try {
        return await this.delete(`project/${id}`)
    } catch (err) {
        console.log('Error in deleting project', err)
        throw err
    }
}


module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
}
