import { transports, createLogger, format } from 'winston'
import * as rotate from 'winston-daily-rotate-file'
import config from '../config/config.dev'
import * as fs from 'fs';

const dir = config.logFileDir;

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}


let logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'MM-YY-DD hh:mm:ss' }),
        format.json()
    ),
    // level: 'info',
    transports: [
        new (transports.Console)({
            colorize: true,
            timestamp: true
        }),
        new transports.DailyRotateFile({
            filename: config.logFileName,
            dirname: config.logFileDir,
            maxsize: 20971520, //20MB
            maxFiles: 25,
            datePattern: '.dd-MM-yyyy'
        })
    ]
})

export default logger;