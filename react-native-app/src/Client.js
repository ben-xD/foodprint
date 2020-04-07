import Config from 'react-native-config';
import auth from '@react-native-firebase/auth';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: Config.SERVER_URL,
  request: async (operation) => {
    if (!auth().currentUser) {
      return;
    }
    // Following refreshes the token automatically if needed:
    const token = await auth().currentUser.getIdToken();
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

export default client;
