import React from 'react';
import Correction from '../Correction';
import { useMutation } from '@apollo/react-hooks';

import renderer from 'react-test-renderer';

jest.mock('@apollo/react-hooks');

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
