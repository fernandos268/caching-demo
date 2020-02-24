// import Mongoose from 'mongoose';
import orm from '../utils/thinky-loader-fork'
import models from '../schemas'
import logger from '../core/logger/app-logger'
import config from '../core/config/config.dev'

const connectToRethink = async () => {
    let ormConfig = {
        // modelsPath: path.join(__dirname, '../schemas'),
        models,
        // debug: true,
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

    orm.initialize(ormConfig)
        .then(() => logger.info('Okay Rethink connection'))
        .catch((err) => logger.error('Error in connecting to Rethink- ' + err));
}

export default connectToRethink;