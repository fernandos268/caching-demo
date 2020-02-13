const typeDefs = `
    type User {
        id: ID
        email: String!
        username: String!
        password: String!
    }

    type Query {
        users: [User]  @cacheControl(maxAge: 20)
        user(id: ID!): User  @cacheControl(maxAge: 20)
    }
`


module.exports = typeDefs