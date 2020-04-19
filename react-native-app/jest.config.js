// https://jestjs.io/docs/en/configuration.html for more configs & descriptions

// Use it as a preset, but also load it to allow
const jestPreset = require('@testing-library/react-native/jest-preset');

module.exports = Object.assign(jestPreset, {
  setupFiles: [
    ...jestPreset.setupFiles,
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: [
    './src/teardown.js',
    './__mocks__/@react-native-community/google-signin',
  ],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // We cannot re use the old ignore pattern (using ...jestPreset.transformIgnorePatterns),
  // because then the 2 lines would 'ignore' each other.
  // Instead, we manually join them into one ignore pattern
  transformIgnorePatterns: [
    'node_modules/(?!victory|react-native-svg|@react-native-community/*|react-native.*|@?react-navigation.*)',
  ],

  // Added according to [victory](https://formidable.com/open-source/victory/docs/native/)
  transform: {
    ...jestPreset.transform,
    '^.+\\.jsx?$': 'babel-jest',
  },

  // We ignore context files because they are implementation details.
  // Refactoring them instantly fails the test. This is recommended by RTL
  // React-testing-library, suggests we check what the user expects the app to do.
  // We ignore some configuration related files, such as BottomTabBar, because they
  // just describe the layout of the tab bar. The functionality is handled by
  // react-navigation library
  coveragePathIgnorePatterns: [
    '<rootDir>/src/context',
    '<rootDir>/src/Client.js',
    'src/containers/BottomTabBar.js',
    'src/strings.js',
  ],
});
