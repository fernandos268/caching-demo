import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {ApolloClient} from 'apollo-client';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'

const link = createHttpLink({ uri: "http://10.110.3.35:5000/graphql" })

const GraphQLClient = new ApolloClient({
   link,
   cache: new InMemoryCache()
 });

ReactDOM.render(
<ApolloProvider client={GraphQLClient}>
   <App/>
</ApolloProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
