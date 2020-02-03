import { AppRegistry } from 'react-native';
import Root from './App';
import { name as appName } from './app.json';
import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

// Create the client as outlined in the setup guide
const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
});

const App = () => (
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => App);
