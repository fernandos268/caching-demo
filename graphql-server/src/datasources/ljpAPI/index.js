const { RESTDataSource } = require('apollo-datasource-rest');
const DataLoader = require('dataloader');

const methods = require('./methods');
module.exports = class ljpAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://localhost:7999';

        //bind methods to this
        Object.entries(methods).forEach(([key, method]) => {
            this[key] = method.bind(this);
        });

    }
    // Data Loaders
    visitsLoader = new DataLoader(async ids => {
        return new Promise(async (resolve, reject) => {
            try {
                const values = await Promise.all(
                    ids.map(id => {
                        return this.get(`/visit/${id}`);
                    })
                );
                resolve(values);
            } catch (err) {
                reject(err);
            }
        });
    });

    projectsLoader = new DataLoader(async ids => {
        return new Promise(async (resolve, reject) => {
            try {
                const values = await Promise.all(
                    ids.map(id => {
                        return this.get(`/project/${id}`);
                    })
                );
                resolve(values);
            } catch (err) {
                reject(err);
            }
        });
    });

    photosLoader = new DataLoader(async ids => {
        return new Promise(async (resolve, reject) => {
            try {
                const values = await Promise.all(
                    ids.map(id => {
                        return this.get(`/photo/${id}`);
                    })
                );
                resolve(values);
            } catch (err) {
                reject(err);
            }
        });
    });


};
