require('dotenv').config()

module.exports = {
    ...process.env,
    APP_PORT: +process.env.PORT || 4000,
}
