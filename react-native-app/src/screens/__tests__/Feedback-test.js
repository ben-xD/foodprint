import React from 'react';

import renderer from 'react-test-renderer';
import Feedback from '../Feedback';
import { useMutation } from '@apollo/client';

jest.mock('@apollo/client');

// Check current component against its snapshot
test('Feedback matches previous snapshot', () => {
  useMutation.mockImplementation(() => [null, { loading: null, error: null, data: null }]);

  const mockedRoute = {
    params: {
      meal: {},
    },
  };

  const tree = renderer.create(<Feedback route={mockedRoute} />).toJSON();
  expect(tree).toMatchSnapshot();
});
