import React from 'react';

import renderer from 'react-test-renderer';
import Feedback from '../Feedback';
import { useMutation } from '@apollo/react-hooks';

jest.mock('@apollo/react-hooks');

// Check current component against its snapshot
test('Feedback matches previous snapshot', () => {
  useMutation.mockImplementation(() => [null, { loading: null, error: null, data: null }]);

  const mockedRoute = {
    params: {
      meal: {},
    },
  };

  let screen;
  const tree = renderer.act(() => {
    screen = <Feedback route={mockedRoute} />;
  });
  expect(screen).toMatchSnapshot();
});
