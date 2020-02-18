const { RESTDataSource } = require('apollo-datasource-rest')

const methods = require('./methods/')

module.exports = class ljpAPI extends RESTDataSource {
    constructor() {
        super()
        this.baseURL = 'http://localhost:4000'

        //bind methods to this
        Object.entries(methods).forEach(([key, method]) => {
            this[key] = method.bind(this)
        })
    }
}

