##GraphQL Server on Google Cloud Functions (GCF)

- [GraphQL with GCF Setup](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-cloud-functions)
- [GraphQL Tutorial](https://www.howtographql.com/graphql-js/1-getting-started/)

### Deploy

1. From the `node-serverless-graphql` directory, run
   `gcloud functions deploy NAME --update-env-vars gcf=true --entry-point handler --runtime nodejs8 --trigger-http`
2. POST HTTP-requests to url returned from (1.)
3. Run `gcloud functions delete NAME` to delete the GCF

### Local Testing

1. Set up $GOOGLE_APPLICATION_CREDENTIALS to point to that file
   1. Get node-serverless-graphql directory using `cd node-serverless-graphql; pwd`. Replace PROJECT_DIRECTORY in the next step with the result.
   2. Add `export GOOGLE_APPLICATION_CREDENTIALS=PROJECT_DIRECTORY/credentials/carbonfootprint-serverless.json` to your `.bashrc` or `.zshrc`, but remember to replace PROJECT_DIRECTORY with the output of the previous step.
   3. Restart your shell
2. Run `npm install` or `npm i` to ensure npm dependencies are installed
3. Run `npm run dev` to run local Apollo server or use `npm run debug` to run local apollo server with debug mode. You can use chrome debugger, go to `chrome://inspect` to get it
4. In your browser, go to url specified to play around
   - Can for example base64-encode an image and send it via a mutation (see `schema.js`)
5. Hit the serverless urls from the react native app, by running `npm run ios:local` or `npm run android:local` inside react native app.

- [Apollo GraphQL Tutorial](https://www.apollographql.com/docs/tutorial/schema/)
