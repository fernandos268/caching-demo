const typeDefs = `
    type User {
        id: ID
        email: String!
        username: String!
        password: String!
    }

    type Query {
        getUsers: [User]
    }
`


module.exports = typeDefs