##GraphQL Server on Google Cloud Functions

- [GraphQL with GCF Setup](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-cloud-functions)
- [GraphQL Tutorial](https://www.howtographql.com/graphql-js/1-getting-started/)

### Deploy
1. Run `gcloud functions deploy NAME --entry-point handler --runtime nodejs8 --trigger-http`
2. POST HTTP-requests to url returned from (1.)  

### Local Testing
1. Run `npm install` to assert modules installed
2. Run `npm start` to run local Apollo server
3. Go to url specified in your browser to play around
- [Apollo GraphQL Tutorial](https://www.apollographql.com/docs/tutorial/schema/)

