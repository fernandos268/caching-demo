import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import ApolloClient from 'apollo-client';
import { createHttpLink } from "apollo-link-http";

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Create WebSocket client
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true
  }
});

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql", })
// const link = createPersistedQueryLink().concat(wsLink);
console.log('ws link', wsLink)
console.log('create http link ', httpLink)
const link = createPersistedQueryLink().concat(createHttpLink({ uri: "http://localhost:4000/graphql", }));


const GraphQLClient = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={GraphQLClient}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
