# NodeJS GraphQL serverless backend

## Environment Setup

Steps were simplified and extended from [docs](https://cloud.google.com/run/docs/setup#before-you-begin).

- Install and initialize the [Cloud SDK](https://cloud.google.com/sdk/docs/)
- Set default platform and regions
  - `gcloud config set run/region europe-west1`
    - We use this because it is the closest region providing cloud run
  - `gcloud config set run/platform managed`
    - We used this so google manages most things for us.
    - Big companies with kubernetes will want to use the 'Cloud Run for Anthos', allowing them to deploy from Anthos GKE cluster. Anthos is a platform incorporating istio (service mesh) and knative (simplifies and extends kubernetes) by Google. For more info, [read this](https://cloud.google.com/run/choosing-a-platform).
- Install docker locally
- Configure docker with
  - `gcloud auth configure-docker`
  - `gcloud components install docker-credential-gcr`
- Get credentials from someone who can
- Login with credentials
  - `gcloud auth login`
- Ensure correct account selected
  - `gcloud auth list` and if needed, `gcloud config set account`ACCOUNT``
- Ensure correct project selected
  - `gcloud config list project` and if needed, `gcloud config set project carbon-footprint-2020`

## Environment setup (only for node projects)

- Install node/ npm

## Contributing and deploying

- Run server in watch mode: `npm run watch`
- Make changes to server, refresh browser (no need to refresh server)
- Once you are satisfied with changes:
  - Run all tests locally (after test coverage increases, may need to be selective)
  - Submit merge request, pull in the latest changes from master _if_ there are **merge conflicts**.
  - Deployment: (TODO: create and trigger deployment pipeline here)
    - Pull in the latest changes from master
    - Upload container to registry using `gcloud builds submit --tag gcr.io/carbon-footprint-2020/CONTAINER_NAME_VERSION`
    - gcloud build will run tests remotely
    - Ensure docker is running **and ready**, and test container locally with docker using [guide](https://cloud.google.com/run/docs/testing/local) or `npm run docker:local`
    - Deploy container to production with `gcloud run deploy --image gcr.io/carbon-footprint-2020/CONTAINER_NAME_VERSION --platform managed`
      - Use default service name
      - Allow unauthenticated invocations
