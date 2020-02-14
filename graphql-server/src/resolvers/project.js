module.exports = {
    Query: {
        async projects(_, __, {dataSources, r}) {
            console.log('Fetching projects....')
            const result = dataSources.ljpAPI.getProjects()
            console.log("TCL: projects -> result", result)
            return result
        }
    }
}