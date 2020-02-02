const {createWriteStream, unlink} = require('fs');
const shortid = require('shortid');
// Use module apollo-server for local testing
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

/* Inspired by https://github.com/jaydenseric/apollo-upload-examples */

const UPLOAD_DIR = `./uploads`;

const storeUpload = async upload => {
  const {createReadStream, filename, mimetype} = await upload;
  const stream = createReadStream();
  const id = shortid.generate();
  const path = `${UPLOAD_DIR}/${id}-${filename}`;
  const file = {id, filename, mimetype, path};

  await new Promise((resolve, reject) => {
    const writeStream = createWriteStream(path);
    writeStream.on('finish', resolve);
    writeStream.on('error', error => {
      unlink(path, () => {
        reject(error);
      })
    });
    stream.on('error', error => writeStream.destroy(error));
    stream.pipe(writeStream);
  });
  return file;
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {storeUpload}
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});



