const users = [
    {
        id: 1,
        username: 'goldenjayr',
        email: 'goldenjayr@gmail.com',
        password: '12345'
    },
    {
        id: 2,
        username: 'jahara',
        email: 'jahara@gmail.com',
        password: '12345'
    }
]

const resolvers = {
    Query: {
        async users(_, __, { dataSources, r }, info) {
            console.log('Getting users.....')

            r.table('tbl_Project').run().then(function (data) {
                console.log(data)
            }).error(e => console.log(e))

            return dataSources.usersAPI.getUsers()
        },
        async user(_, { id }, { dataSources }) {
            console.log(`Fetching user with id ${id}`)
            return dataSources.usersAPI.getUser(id)
        }
    }
}


module.exports = resolvers
