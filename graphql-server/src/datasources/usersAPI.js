class UsersAPI {
    constructor() {
        this.users = [
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
    }

    async getUsers() {
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.users)
            }, 5000)
        })
    }

    async getUser(id) {
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = this.users.find(user => user.id == id)
                resolve(user)
            }, 3000)
        })
    }
}


module.exports = UsersAPI
