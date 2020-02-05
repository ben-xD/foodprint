const resolvers = {
    Query: {
        _: () => {}
    },
    Mutation: {
        postPicture: (parent, {file}) => {
            return {
                product: {
                    name: 'apple',
                },
            };
        }
    },
};

module.exports = resolvers;
