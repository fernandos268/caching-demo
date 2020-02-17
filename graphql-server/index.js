const { ApolloServer } = require('apollo-server-express')
const { RedisCache } = require('apollo-server-cache-redis')
const responseCachePlugin = require('apollo-server-plugin-response-cache')

const app = require('express')()
const httpServer = require('http').createServer(app)

global.config = require('./config')

const {
  APP_PORT
} = config

const typeDefs = require('./src/typeDefs')
const resolvers = require('./src/resolvers')
const { ljpAPI } = require('./src/datasources')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ctx => ({}),
  dataSources: () => ({ ljpAPI: new ljpAPI() }),
  cache: new RedisCache({
    host: 'localhost',
  }),
  persistedQueries: {
    cache: new RedisCache({
      host: 'localhost',
    }),
  },
  cacheControl: true,
  plugins: [responseCachePlugin()]
})

server.applyMiddleware({ app, path: '/graphql' });
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: APP_PORT }, () => {
  console.log(
    `Apollo Server websocket on  localhost:${APP_PORT}${server.subscriptionsPath}`
  )
  console.log(`Apollo Server http on localhost:${APP_PORT}${server.graphqlPath}`)
})
