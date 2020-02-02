const resolvers = {
    Query: {
        uploads: () => "To do..."
    },
    Mutation: {
        singleUpload: (parent, {file}, {storeUpload}) => storeUpload(file)
    }
};

module.exports = resolvers;
