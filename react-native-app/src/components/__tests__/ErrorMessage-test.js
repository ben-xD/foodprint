import React from 'react';
import ErrorMessage from '../ErrorMessage';
import { useMutation } from '@apollo/react-hooks';

import renderer from 'react-test-renderer';

jest.mock('@apollo/react-hooks');

// Check current component against its snapshot
test('ErrorMessage renders correctly and is the same as its previous snapshot', () => {
  useMutation.mockImplementation(() => [null, { loading: null, error: null, data: null }]);
  const tree = renderer.create(<ErrorMessage isVisible={true} />).toJSON();
  expect(tree).toMatchSnapshot();
});
