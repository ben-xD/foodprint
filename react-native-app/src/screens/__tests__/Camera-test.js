import React from 'react';

import renderer from 'react-test-renderer';
import Camera from '../Camera';
import { useMutation } from 'react-apollo';

jest.mock('@apollo/react-hooks');

// Check current component against its snapshot
test('FoodOverview matches previous snapshot', () => {
  useMutation.mockImplementation(() => [null, { loading: null, error: null, data: null }]);
  const tree = renderer.create(<Camera />).toJSON();
  expect(tree).toMatchSnapshot();
});

// TODO mock data response from graphQL, and do more tests
