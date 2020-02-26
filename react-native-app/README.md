# Mobile application

Written in javascript with react native, and associated libraries (react-navigation, jest).

## npm run options
You can run these by running npm run CODE, where code is:

- `android` runs on an emulator (or device, if android and device is plugged in) (because it uses .env file).
- `android:local`, like `android`, but points the backend requests to a locally hosted server. You need to run the server in this case.
- `a` is shorthand for android
- `ios`, ios version of `android`
- `release` does `android`, but runs the javascript without debug mode (faster, no debug messages, no reliance on Metro server (which serves your js files to the device/ emulator)).
- `a:bundle` generates an app bundle file in the `android/build`, and can be uploaded to the google play console to release the app. This is used because it is more convenient than uploading an APK. Recommended by Google.
- `a:apk` generates an APK file in the `android/build`, and can be manually installed on devices or shared with others, so they can manually install them. This can't be done with an app bundle.

## Development guide & testing

- When you run `git commit`, husky runs all the tests and only lets you commit if they pass
- To run all the tests, run `npm run test`. To run specific tests, use the run button next to the test in WebStorm
- There are tests for components, so whenever a component gets changed, it fails the tests and requires to update the relevant snapshot:
  - Check the snapshot tests that failed and if you are happy with the changes, run `npm run test -u` to update the snapshots
  - Commit your updated snapshot

## Problems?

- Make sure you node_modules folder is up to date with `npm install`
- iOS problems? Make sure your pod dependencies are up to date with `cd ios` then `npm ios`
- Stackoverflow your problem
  - For example, JDK 13 is not supported by react-native fully. Using some features of react native for android causes error.

## Technology overview

We are using react native, so its very useful to understand react (**not** including react-dom) & react native. There are many tutorials available online, and the [react native website](https://facebook.github.io/react-native/) is a good starting point.

We are using (react-navigation](https://reactnavigation.org/) (**not** v4.x but **v5** aka. **next**) to allow navigation between different parts of the tab, for example the tab bar at the bottom, and the 'stack' navigation, where a new screen stacks onto your current screen. It will be very helpful to know how navigation works.

We are also using many different libraries to allow support for camera, and future functionality.

The react-native-elements component library is already installed to the app, and you can use them.

The code is typescript (a superset of javascript), which means you **can** just type javascript like normal. If you wanted to learn/ code in typescript to add type safety, you can do that and start using types in the code. It will only help you and other developers.

## Getting setup

- You need [node](http://nodejs.org/)
- You need either XCode and iOS simulator **or** Android Studio and Android Emulator set up following this [guide](https://facebook.github.io/react-native/docs/next/getting-started) **React native CLI Quickstart**, not **Expo CLI**.
- go into the `/react-native-app` and install dependencies `npm install` (this is needed because dependencies are not uploaded to gitlab)
- Run on android: npm run android
- Run on iOS:

  - execute `cd ios; pod install; cd..`
  - **Note:** After these dependencies change to because of further development, you might get dependency errors. First port of call is to run the above command.
  - npm run ios

- TODO add steps for running on a physical Android or Apple device

## Apollo Client

Setup [here](https://www.apollographql.com/docs/react/get-started/) and
[here](https://github.com/jaydenseric/apollo-upload-examples)
