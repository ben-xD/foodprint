import * as admin from 'firebase-admin';
import { AuthenticationError } from 'apollo-server';

// idToken comes from the client app
const getUser = (idToken) => new Promise((resolve, reject) => {
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      const { uid } = decodedToken;
      resolve(decodedToken);
    }).catch((error) => {
      // Returning empty user, to signify no user
      resolve('');
      // or alternatively reject(error).
    });
});

const context = ({ req }) => {
  const token = req.headers.authorization || '';
  const user = getUser(token);
  console.log({ user });

  // optionally block the user
  // we could also check user roles/permissions here
  // if (!user) throw new AuthenticationError('you must be logged in');

  return { user };
};

export default context;
