const {createWriteStream, unlink} = require('fs');
// const shortid = require('shortid');

/* Inspired by https://github.com/jaydenseric/apollo-upload-examples */
const UPLOAD_DIR = `./uploads`;

const storeUpload = async upload => {
    const {createReadStream, filename, mimetype} = await upload;
    const stream = createReadStream();
    const id = 1;
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

const resolvers = {
    Query: {
        uploads: () => {
            console.log('Sending response to query...');
            return "To do...";
        }
    },
    Mutation: {
        test: (_, {input}) => {
            console.log('Sending response to mutation...');
            console.log(input);
            return "Hello"
        },
        singleUpload: (parent, {file}) => {
            // storeUpload(file);
            console.log(file.uri);
            return 'Received...';
        }
    },
};

module.exports = resolvers;
