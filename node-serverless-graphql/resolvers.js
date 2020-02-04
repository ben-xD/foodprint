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
        singleUpload: (parent, {file}, {storeUpload}) => storeUpload(file)
    },
};

module.exports = resolvers;
