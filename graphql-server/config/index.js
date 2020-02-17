require('dotenv').config()

module.exports = {
    ...process.env,
    APP_PORT: +process.env.APP_PORT
}
