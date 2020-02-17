const { RESTDataSource } = require('apollo-datasource-rest')

const methods = require('./methods/')

module.exports = class ljpAPI extends RESTDataSource {
    constructor() {
        super()
        this.baseURL = 'http://localhost:4000'

        //methods
        Object.entries(methods).forEach(([key, func]) => {
            this[key] = func.bind(this)
        })
    }
}
