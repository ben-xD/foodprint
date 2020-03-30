##GraphQL Server on Google Cloud Functions (GCF)

- [GraphQL with GCF Setup](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-cloud-functions)
- [GraphQL Tutorial](https://www.howtographql.com/graphql-js/1-getting-started/)

### Run scripts

NPM run scripts are shortcuts for running programs.

- start: Run this to run without using the chrome debugger. This is the script that gets run in production.
- debug: Run this to be able to open the chrome debugger, which is more readable. To open the debugger, open chrome at url `chrome://inspect`, then click `Open dedicated DevTools for Node`. Also, this will automatically reload the server when you change files. Having trouble running locally? You need to expose the localhost:4000 to the app, by using `adb reverse tcp:4000 tcp:4000`. For more details, see [documentation](https://android.googlesource.com/platform/system/core/+/master/adb/SERVICES.TXT).

### Deploy

Set-up (You need to be authenticated with a 'service account user' to deploy to gcloud.):

- You need gcloud installed. Find the correct install file from [docs][(https://cloud.google.com/sdk/docs/quickstart-macos](https://cloud.google.com/sdk/docs/quickstart-macos#before-you-begin)). Follow step 3, 4 and 5 under 'Before you begin', or just download the latest version, and follow the steps below
  - Change directory to where the extracted folder is, then `mv google-cloud-sdk /usr/local/lib/google-cloud-sdk`
  - `cd /usr/local/lib` then `./google-cloud-sdk/install.sh`
  - Restart your terminal
- `cd node-serverless-graphql` if not in the folder already.
- Run `gcloud auth activate-service-account --key-file credentials/carbonfootprint-serverless.json`
- Set the project to this one, using `gcloud config set project carbon-footprint-2020`
- To debug and read the logs for the server, you need your permission on Google account. Send your gmail account to Ben, and ask him to add you. You can then search for `cloud functions` at [Google Console](https://console.developers.google.com/)

Every time you want to deploy to gcloud, replacing the old instance:

1. Configure gcloud to deploy to London, with `gcloud config set functions/region europe-west2`
2. From the `node-serverless-graphql` directory, run `gcloud functions deploy NAME --entry-point handler --runtime nodejs10 --trigger-http --region=europe-west2`, Replace NAME with 'foodprint', as that is what I have deployed to gcloud, and also set it on react native. NAME is the name of the function on google cloud. Handler is the name of the function in code (`index.js`).
3. POST HTTP-requests to url returned from (1.)
4. To delete, run `gcloud functions delete NAME`

### Running Locally

1. Set up \$GOOGLE_APPLICATION_CREDENTIALS to point to that file
   1. Get node-serverless-graphql directory using `cd node-serverless-graphql; pwd`. Replace PROJECT_DIRECTORY in the next step with the result.
   2. Add `export GOOGLE_APPLICATION_CREDENTIALS=PROJECT_DIRECTORY/credentials/carbonfootprint-serverless.json` to your `.bashrc` or `.zshrc`, but remember to replace PROJECT_DIRECTORY with the output of the previous step.
   3. Restart your shell
2. Run `npm install` or `npm i` to ensure npm dependencies are installed
3. Run `npm run start` to run local Apollo server or use `npm run debug` to run local apollo server with debug mode. You can use chrome debugger, go to `chrome://inspect` to get it
4. In your browser, go to url specified to play around
   - Can for example base64-encode an image and send it via a mutation (see `schema.js`)
5. Hit the serverless urls from the react native app, by running `npm run ios:local` or `npm run android:local` inside react native app.

### Testing Jesting

- Run `yarn test` run all the test or press the run button in your IDE next the test you want to run
- Run `yarn test:coverage` to get the coverage report. It'll be saved in the coverage folder. Then open the index.html in that folder to get a nice interface.
- More resources [Jest](https://jestjs.io/docs/en/getting-started)

* [Apollo GraphQL Tutorial](https://www.apollographql.com/docs/tutorial/schema/)
