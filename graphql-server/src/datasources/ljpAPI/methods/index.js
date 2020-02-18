const projectMethods = require('./project')
const visitMethods = require('./visit')
const photoMethods = require('./photo')

module.exports = {
    ...projectMethods,
    ...visitMethods,
    ...photoMethods
}