const resolvers = {
    Query: {
        _: () => {}
    },
    Mutation: {
        postPicture: (parent, {file}) => {
            console.log(file);
            return {
                product: {
                    name: 'apple',
                },
            };
        }
    },
};

module.exports = resolvers;
