const { RESTDataSource } = require('apollo-datasource-rest')
const DataLoader = require('dataloader')

const methods = require('./methods')

module.exports = class ljpAPI extends RESTDataSource {
    constructor() {
        super()
        this.baseURL = 'http://localhost:4000'

        //bind methods to this
        Object.entries(methods).forEach(([key, method]) => {
            this[key] = method.bind(this)
        })

    }

    // Data Loaders
    visitsLoader = new DataLoader(ids => {
        return new Promise(async (resolve, reject) => {

            const values = await Promise.all(ids.map(id => {
                return this.get(`/visit/${id}`)
            }))
            resolve(values)
        })
    })

}