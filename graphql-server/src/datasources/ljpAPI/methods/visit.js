
async function getVisits(params) {
    try {
        return await this.get(`/visit`, params)
    } catch (err) {
        console.log('Error in getting visits:', err)
        throw err
    }
}


async function getVisitById(id) {
    try {
        return this.visitsLoader.load(id)
    } catch (err) {
        console.log('Error in fetching visit: ', err)
        throw err
    }
}

async function getVisitsByProject(args) {
    const { project_id, params } = args
    try {
        return await this.get(`/project/${project_id}/visits`, params)
    } catch (err) {
        console.log('Error in getting visits by projects', err)
        throw err
    }
}


async function createVisit(input) {
    try {
        return await this.post(`visit`, input)
    } catch (err) {
        console.log('Error in creating visit', err)
        throw err
    }
}

async function updateVisit({ id, ...input }) {
    try {
        return await this.put(`visit/${id}`, input)
    } catch (err) {
        console.log('Error in updating visit', err)
        throw err
    }
}

async function deleteVisit(id) {
    try {
        return await this.delete(`visit/${id}`)
    } catch (err) {
        console.log('Error in deleting visit', err)
        throw err
    }
}

module.exports = {
    getVisits,
    getVisitById,
    getVisitsByProject,
    createVisit,
    updateVisit,
    deleteVisit
}
