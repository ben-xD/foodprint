// Integration/system tests of the server

const { ApolloServer } = require('apollo-server-cloud-functions');
const { createTestClient } = require('apollo-server-testing');
const typeDefs = require('../schema.js');
const resolvers = require('../resolvers.js');
const { gql } = require('apollo-server');

const VisionAPI = require('../datasources/vision');
const visionCredentials = require('../credentials/carbon-7fbf76411514.json');
const CarbonAPI = require('../datasources/carbon');
const ConceptAPI = require('../datasources/concept');

const carbonAPI = new CarbonAPI();

const dataSources = () => ({
  visionAPI: new VisionAPI(visionCredentials),
  carbonAPI: carbonAPI,
  conceptAPI: new ConceptAPI()
});


const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  // context,
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

  it('postCorrection: fetches carbon footprint of rice', async () => {
   const res = await mutate({mutation:POST_CORRECTION_MUTATION, variables: {name: 'rice'}});
   expect(res).toMatchSnapshot();
  });

});
