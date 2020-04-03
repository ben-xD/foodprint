// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

// We use it as a preset, but also load it to allow 
const jestPreset = require('@testing-library/react-native/jest-preset');

module.exports = Object.assign(jestPreset, {
  setupFiles: [
    ...jestPreset.setupFiles,
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./src/teardown.js'],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // We cannot re use the old ignore pattern (using ...jestPreset.transformIgnorePatterns), 
  // because then the 2 lines would 'ignore' each other. 
  // Instead, we manually join them into one ignore pattern
  transformIgnorePatterns: [
    "node_modules/(?!victory|react-native-svg|@react-native-community/*|react-native.*|@?react-navigation.*)",
  ],

  // Added according to [victory](https://formidable.com/open-source/victory/docs/native/)
  transform: {
    ...jestPreset.transform,
    "^.+\\.jsx?$": "babel-jest"
  },
})
