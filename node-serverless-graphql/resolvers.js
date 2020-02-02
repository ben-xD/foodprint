class Picture {
    constructor({title, image}) {
        this.title = title;
        this.image = image;
    }
}

const resolvers = {
    Query: {
        getPicture: (_, {title}) => {
            return new Picture({title: title, image: "Test-image"});
        }
    },
    Mutation: {
        postPicture: (_, {title}) => {
            return new Picture({title: title, image: "Test-image"});
        }
    }
};

module.exports = resolvers;
