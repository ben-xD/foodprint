

module.exports = {
  ...require('react-native-reanimated/mock'),
  addWhitelistedNativeProps: () => jest.fn(() => { }),
};
