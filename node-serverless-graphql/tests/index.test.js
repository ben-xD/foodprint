// Integration/system tests of the server

const { ApolloServer } = require('apollo-server-cloud-functions');
const { createTestClient } = require('apollo-server-testing');
const { gql } = require('apollo-server');
const orangeImage = require('./orange_image');

const typeDefs = require('../schema.js');
const resolvers = require('../resolvers.js');

const VisionAPI = require('../datasources/vision');
const visionCredentials = require('../credentials/carbon-7fbf76411514.json');
const CarbonAPI = require('../datasources/carbon');
const ConceptAPI = require('../datasources/concept');
const { createStore, deleteStore } = require('../utils');


const store = createStore();

const carbonAPI = new CarbonAPI(store);

const dataSources = () => ({
  visionAPI: new VisionAPI(visionCredentials),
  carbonAPI,
  conceptAPI: new ConceptAPI(),
});

const context = () => ({
  user: { uid: 'fakeUID', email: 'fakeEmail@foodprint.com' },
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  playground: true,
  introspection: true,
});

const { query, mutate } = createTestClient(server);

// GraphQL schema for correction mutation
const POST_CORRECTION_MUTATION = gql`
    mutation PostCorrectionMutation($name: String!) {
        postCorrection(name: $name) {
            name
            carbonFootprintPerKg
        }
    }
`;

// GraphQL schema for picture posting mutation
const POST_PICTURE_MUTATION = gql`
    mutation PostPictureMutation($file: PictureFile) {
        postPicture(file: $file) {
            name
            carbonFootprintPerKg
        }
    }
`;


describe('Real dataSources with mocked user', () => {
  jest.setTimeout(30000);

  it('postPicture: fetches carbon footprint of image with orange that is classified as citrus', async () => {
    const file = { base64: orangeImage };
    const res = await mutate({ mutation: POST_PICTURE_MUTATION, variables: { file } });
    expect(res).toMatchSnapshot();
  });

  it('postCorrection: fetches carbon footprint of orange', async () => {
    const res = await mutate({ mutation: POST_CORRECTION_MUTATION, variables: { name: 'orange' } });
    expect(res).toMatchSnapshot();
  });
});

afterAll(() => {
  deleteStore();
});
