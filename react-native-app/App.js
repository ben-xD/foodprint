import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './src/containers/Tabs';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import SignupOrRegister from './src/screens/SignupOrRegister';
import { ApolloProvider } from '@apollo/react-hooks';
import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-boost';

const Stack = createStackNavigator();

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://df7aaaa5.ngrok.io', // Replace with your ngrok or GCF url
  }),
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <NavigationNativeContainer>
        <Stack.Navigator initialRouteName="Back" >
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            screenOptions={{ headerShown: false }}
          />
          <Stack.Screen name="Back" component={SignupOrRegister} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
      </NavigationNativeContainer>
    </ApolloProvider>
  );
};

export default App;
