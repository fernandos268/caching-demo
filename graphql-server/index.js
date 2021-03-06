const { ApolloServer } = require('apollo-server-express')
const { RedisCache } = require('apollo-server-cache-redis')
// const Redis = require('ioredis')
const responseCachePlugin = require('apollo-server-plugin-response-cache')
const cors = require('cors')
const redis = require('redis')
const app = require('express')()


const httpServer = require('http').createServer(app)

global.config = require('./config')

const {
  APP_PORT,
  REDIS_HOST,
  REDIS_PORT
} = config

const typeDefs = require('./src/typeDefs')
const resolvers = require('./src/resolvers')
const { ljpAPI } = require('./src/datasources')
const { CustomRedis } = require('./src/context')

const CustomRedisCache = require('./utils/CustomRedisCache')

const {
  cacheFunctions
} = require('./utils')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ctx => ({
    ...ctx,
    redis: new CustomRedis({
      host: REDIS_HOST
    })
  }),
  dataSources: () => ({
    ljpAPI: new ljpAPI(),

  }),
  cache: new CustomRedisCache(REDIS_HOST),
  persistedQueries: {
    cache: new RedisCache({
      host: REDIS_HOST,
    }),
  },
  cacheControl: true,
  plugins: [responseCachePlugin()]
})

server.applyMiddleware({
  app,
  cors: {
    origin: '*'
  }
})
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: APP_PORT }, () => {
  console.log(
    `Apollo Server websocket on  localhost:${APP_PORT}${server.subscriptionsPath}`
  )
  console.log(`Apollo Server http on localhost:${APP_PORT}${server.graphqlPath}`)
})
