import React from 'react';

import renderer from 'react-test-renderer';
import Camera from '../Camera';

// Check current component against its snapshot
test('FoodOverview matches previous snapshot', () => {
  const tree = renderer.create(<Camera />).toJSON();
  expect(tree).toMatchSnapshot();
});
