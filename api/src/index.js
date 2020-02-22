import 'dotenv/config';
import express from 'express';
// import { createServer, plugins } from 'restify'
import cors from 'cors';
import morgan from 'morgan'
import bodyParser from "body-parser";
import logger from './core/logger/app-logger'
import config from './core/config/config.dev'
import connectToRethink from './db/connectToRethink';
import connectToOrient from './db/connectToOrient';

import orientRoute from './routes/orient.route';
import project from './routes/project.route'
import visit from './routes/visit.route'
import photo from './routes/photo.route'
// import migrate from './db/migrate';
import migration from './migration'
import redisCache from './migration/redis-cache';

const port = config.serverPort;
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};
const app = express();

const run = async () => {
  await connectToRethink();
  const orient = await connectToOrient()
  // const cacheresult = await redisCache(orient)
  // console.log('cacheresult: ', cacheresult);
  await migration(orient);
  console.log('After Migrate');

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan("dev", { "stream": logger.stream }));
  app.use('/project', project);
  app.use('/visit', visit);
  app.use('/photo', photo);
  app.use('/orient', orientRoute(orient));

  //Index route
  app.get('/', (req, res) => {
    res.send('Invalid endpoint!');
  });

  app.listen(port, () => {
    logger.info(`server started - ${port}`);
  });
}

run().catch((err) => logger.error('Error in index-', err));
