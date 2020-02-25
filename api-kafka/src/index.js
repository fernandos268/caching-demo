import 'dotenv/config';
import express from 'express';
// import { createServer, plugins } from 'restify'
import cors from 'cors';
import morgan from 'morgan'
import bodyParser from "body-parser";
import kafka from 'kafka-node'

import logger from './core/logger/app-logger'
import config from './core/config/config.dev'
import connectToRethink from './db/connectToRethink';
import connectToOrient from './db/connectToOrient';

import migration from './migration'
import redisCache from './migration/redis-cache';

//-----------------------------------------------------------------------------------------------------------------
import db_functions from './db_functions'
import cache_functions from './cache_functions'
//-----------------------------------------------------------------------------------------------------------------

const port = config.serverPort;
logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
};
const app = express();

; (async () => {
  await connectToRethink();
  // const orient = await connectToOrient()
  // const cacheresult = await redisCache(orient)
  // console.log('cacheresult: ', cacheresult);
  // await migration(orient);

  app.use(cors());

  //-----------------------------------------------------------------------------------------------------------------
  // KAKFA STUFF

  const topics = [
    'cachedemo-mutation',
  ]

  const options = {
    autoCommit: true,
    fromOffset: 'latest',
    groupId: 'CACHE_DEMO_KAFKA'
  }

  const consumer = new kafka.ConsumerGroup(options, topics);

  const client = new kafka.KafkaClient({ kafkaHost: config.kafkaHost })
  const HighLevelProducer = kafka.HighLevelProducer
  const producer = new HighLevelProducer(client)

  const cacheFunctions = new cache_functions({
    host: config.redisHost
  })

  consumer.on('message', async message => {
    const {
      topic,
      value
    } = message
    const parsed_message = JSON.parse(value)

    if (topic === 'cachedemo-mutation') {
      console.log('consumer --> value --> ', topic, parsed_message)
      const {
        operation,
        origin_user_id,
        entity,
        input
      } = parsed_message

      let response_message

      // CREATE -------------------------------------------------------------------------
      if (operation === 'create') {
        const createdNode = await db_functions.createNode({ entity, input })
        console.log('createdNode: ', createdNode);

        response_message = {
          operation: 'create',
          entity: 'project',
          origin_user_id,
          status: createdNode ? 'success' : 'failed',
        }

      }
      // UPDATE -------------------------------------------------------------------------
      if (operation === 'update') {
        const updatedNode = await db_functions.updateNode({ entity, input })

        if (updatedNode) {
          console.log('updatedNode: ', updatedNode);
          await cacheFunctions.updateAllCache(input, entity)
        }

        response_message = {
          operation: 'update',
          entity: 'project',
          origin_user_id,
          updatedNode: updatedNode ? updatedNode : null,
          success: updatedNode ? 'success' : 'failed',
        }

      }

      // DELETE -------------------------------------------------------------------------
      if (operation === 'delete') {
        const { id } = input
        const deletedId = await db_functions.deleteNode({ entity, id })

        if (deletedId) {
          console.log('deletedId: ', deletedId);
          await cacheFunctions.deleteObjectInCache(id, entity)
        }

        response_message = {
          operation: 'update',
          entity: 'project',
          origin_user_id,
          deletedId: deletedId ? deletedId : null,
          success: deletedId ? 'success' : 'failed',
        }
      }

      const kafka_message = {
        topic: 'cachedemo-mutation-response',
        messages: [JSON.stringify(response_message)]
      }

      const payloads = [kafka_message]
      producer.send(payloads, (error, data) => {
        console.log('send -> db result', data)
      })

    }

  })

  //-----------------------------------------------------------------------------------------------------------------

  app.listen(port, () => {
    logger.info(`server started - ${port}`);
  });
})().catch((err) => logger.error('Error in index-', err))
