import React from 'react';

import renderer from 'react-test-renderer';
import Loading from '../Loading';

// Check current component against its snapshot
test('ErrorMessage renders correctly and is the same as its previous snapshot', () => {
  const tree = renderer.create(<Loading />).toJSON();
  expect(tree).toMatchSnapshot();
});
