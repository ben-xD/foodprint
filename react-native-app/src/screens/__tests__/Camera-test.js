import React from 'react';

import renderer from 'react-test-renderer';
import { render } from '@testing-library/react-native';
import Camera from '../Camera';
import { useIsFocused } from '@react-navigation/native';
import { useMutation } from '@apollo/client';

jest.mock('@apollo/client');
jest.mock('@react-navigation/native');

// Check current component against its snapshot
test('FoodOverview matches previous snapshot', () => {
  useMutation.mockImplementation(() => [null, { loading: null, error: null, data: null }]);
  useIsFocused.mockImplementation(() => true);
  const tree = renderer.create(<Camera />).toJSON();
  expect(tree).toMatchSnapshot();
});

// TODO mock data response from graphQL, and do more tests
test('Take picture on camera', async () => {
  // useMutation.mockImplementation(() => [null, { loading: null, error: null, data: null }]);

  // const onTakePhotoEvent = jest.fn(data => data);

  render(<Camera />);
  // const snapButton = utils.getByLabelText('take picture')
  // console.log({ snapButton })
  // fireEvent.press(joinButton);
  // expect(onTakePhotoEvent.mock.calls.length).toBe(1);
});
