import 'dotenv/config';
import express from 'express';
// import { createServer, plugins } from 'restify'
import cors from 'cors';
import morgan from 'morgan'
import bodyParser from "body-parser";
import kafka from 'kafka-node'
import util from 'util'
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


  const client = new kafka.KafkaClient({ kafkaHost: config.kafkaHost })

  const topics = [
    'cachedemo-mutation',
  ]

  const options = {
    kafkaHost: config.kafkaHost,
    autoCommit: true,
    fromOffset: 'latest',
    groupId: 'CACHE_DEMO_KAFKA'
  }

const topicsToCreate = [
  {
    topic: "cachedemo-mutation",
    partitions: 10,
    replicationFactor: 3
  }
];

// create kafka topics
client.createTopics(topicsToCreate, (error, result) => {
  if (error) console.log(error);
  console.log(
    `Result of creating topic is ${util.inspect(result, false, null, true)}`
    );
  });
  const consumer = new kafka.ConsumerGroup(options, topics);
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
        console.log('updatedNode: ', updatedNode);

        if (updatedNode.id) {
          await cacheFunctions.updateAllCache(input, entity)
        }

        response_message = {
          operation: 'update',
          entity: 'project',
          origin_user_id,
          updatedNode: updatedNode.id ? updatedNode : null,
          success: updatedNode.id ? true : false,
          error: !updatedNode.id ? updatedNode : null
        }

      }

      // DELETE -------------------------------------------------------------------------
      if (operation === 'delete') {
        const { id } = input
        const result = await db_functions.deleteNode({ entity, id })

        if (result.isSuccess) {
          console.log('result: ', result);
          await cacheFunctions.deleteObjectInCache(id, entity)
        }

        response_message = {
          operation: 'delete',
          entity: 'project',
          origin_user_id,
          deletedId: result.id ? result.id : null,
          success: result.id ? true : false,
          error: !result.id ? result : null
        }
      }

      console.log('RESPONSE_MESSAGE >>>>', response_message)

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
})()
