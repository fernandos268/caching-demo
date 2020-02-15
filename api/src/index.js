import 'dotenv/config';
import express from 'express';
// import { createServer, plugins } from 'restify'
import cors from 'cors';
import morgan from 'morgan'
import bodyParser from "body-parser";
import logger from './core/logger/app-logger'
import config from './core/config/config.dev'
import connectToDb from './db/connect';

import project from './routes/project.route'

const port = config.serverPort;
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

connectToDb();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev", { "stream": logger.stream }));
app.use('/project', project)

//Index route
app.get('/', (req, res) => {
  res.send('Invalid endpoint!');
});

app.listen(port, () => {
  logger.info('server started - ', port);
});