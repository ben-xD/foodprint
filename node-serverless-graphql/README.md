##GraphQL Server on Google Cloud Functions (GCF)

- [GraphQL with GCF Setup](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-cloud-functions)
- [GraphQL Tutorial](https://www.howtographql.com/graphql-js/1-getting-started/)

### Deploy
1. From the `node-serverless-graphql` directory, run
    `gcloud functions deploy NAME --update-env-vars gcf=true --entry-point handler --runtime nodejs8 --trigger-http`
    # - Might need slight change to schema (`scalar Upload` must be defined)
2. POST HTTP-requests to url returned from (1.)
3. Run `gcloud functions delete NAME` to delete the GCF

### Local Testing
1. Run `npm install` to assert modules installed
2. Run `npm run dev` to run local Apollo server
4. In your browser, go to url specified to play around

- [Apollo GraphQL Tutorial](https://www.apollographql.com/docs/tutorial/schema/)

