const admin = require('firebase-admin');

// idToken comes from the client app
const getUser = (idToken) => new Promise((resolve, reject) => {
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      // const { uid } = decodedToken;
      resolve(decodedToken);
    }).catch((error) => {
      // Returning empty user, to signify no user
      reject(error);
    });
});

const context = async ({ req }) => {
  console.log({ headers: req.headers });
  const authorization = req.headers.authorization || '';
  const token = authorization.replace('Bearer ', '');
  try {
    const user = await getUser(token);
    console.log({ user });
    return { user };
  } catch (err) {
    console.error(err);
    throw new Error('you must be logged in');
  }
  // optionally block the user
  // we could also check user roles/permissions here
  // if (!user) throw new AuthenticationError('you must be logged in');
};

module.exports = context;
