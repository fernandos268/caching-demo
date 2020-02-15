// import Mongoose from 'mongoose';
import orm from '../utils/thinky-loader-fork'
import models from '../schemas'
import logger from '../core/logger/app-logger'
import config from '../core/config/config.dev'

const connectToDb = async () => {
    let ormConfig = {
        // modelsPath: path.join(__dirname, '../schemas'),
        models,
        debug: true,
        thinky: {
            rethinkdb: {
                host: config.dbHost,
                port: config.dbPort,
                authKey: "",
                db: config.dbName,
                timeoutError: 5000,
                buffer: 5,
                max: 1000,
                timeoutGb: 60 * 60 * 1000
            }
        }
    };

    // returns a promise when configured
    orm.initialize(ormConfig) // you can also optionally pass an instance of thinky: [orm.initialize(ormConfig, thinky)] for additional configuration.
        .then(() => logger.info('Okay connection'))
        .catch((err) => logger.error('Error in connecting- ' + err));
}

export default connectToDb;