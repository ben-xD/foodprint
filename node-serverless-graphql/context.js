const admin = require('firebase-admin');

const getUser = (idToken) => new Promise((resolve, reject) => {
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      // const { uid } = decodedToken;
      resolve(decodedToken);
    }).catch((error) => {
      // Or return empty user, to signify no user
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
    return {};
  }
};

module.exports = context;
