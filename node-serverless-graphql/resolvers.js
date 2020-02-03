const resolvers = {
    Query: {
        uploads: () => {
            console.log('Sending response to query...');
            return "To do...";
        }
    },
    // Mutation: {
    //     singleUpload: (parent, {file}, {storeUpload}) => storeUpload(file)
    // }
};

module.exports = resolvers;
