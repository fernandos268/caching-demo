const { ApolloServer } = require('apollo-server-express');
const { RedisCache } = require('apollo-server-cache-redis');
const r = require('rethinkdbdash')({servers: [{host: '10.110.55.100', port: '28015'}], db: 'ljpv2_db' });
const responseCachePlugin = require('apollo-server-plugin-response-cache');

const app = require('express')();
const httpServer = require('http').createServer(app);

const typeDefs = require('./src/typeDefs');
const resolvers = require('./src/resolvers');
const UsersAPI = require('./src/datasources');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ctx => ({
      r
    }),
  dataSources: () => ({usersAPI: new UsersAPI()}),
  cache: new RedisCache({
      host: 'localhost',
  }),
  persistedQueries: {
      cache: new RedisCache({
        host: 'localhost',
    }),
  },
  cacheControl: true,
  plugins: [responseCachePlugin()],
});

server.applyMiddleware({ app, path: '/graphql' });
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 4000 }, () => {
  console.log(
    `Apollo Server websocket on  localhost:4000${server.subscriptionsPath}`
  );
  console.log(`Apollo Server http on localhost:4000${server.graphqlPath}`);
});

//   server.listen().then(({ url }) => {
//     console.log(`🚀  Server ready at ${url}`);
//   });
