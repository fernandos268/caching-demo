const { gql } = require('apollo-server-express')

module.exports = gql`
    input QueryParams {
        limit: Int!
        limitless: Boolean
        page: Int!
    }

`
