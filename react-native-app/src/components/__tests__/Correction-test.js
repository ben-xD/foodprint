import React from 'react';
import Correction from '../Correction';

import renderer from 'react-test-renderer';
import { useMutation } from '@apollo/client';

jest.mock('@apollo/client');

// Check current component against its snapshot
test('Correction matches previous snapshot', () => {

  const mockedRoute = {
    params: {
      meal: {},
    },

  };
  useMutation.mockImplementation(() => [null, { loading: null, error: null, data: null }]);
  const tree = renderer.create(<Correction route={mockedRoute} isVisible={true} />).toJSON();
  expect(tree).toMatchSnapshot();
});
