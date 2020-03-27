const admin = require('firebase-admin');

const getUser = (idToken) => new Promise((resolve, reject) => {
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      // const { uid } = decodedToken;
      // its called decodedToken, but it contains uid!
      resolve(decodedToken);
    }).catch((error) => {
      // Or return empty user, to signify no user
      reject(error);
    });
});

const context = async ({ req }) => {
  const authorization = req.headers.authorization || '';
  const token = authorization.replace('Bearer ', '');
  try {
    const user = await getUser(token);
    return { user };
  } catch (err) {
    console.info("No 'user' object will be available in context, as token was not decoded successfully.")
    // console.info(err);
    return {};
  }
};

module.exports = context;
