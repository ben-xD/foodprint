import React from 'react';

import renderer from 'react-test-renderer';
import FoodOverview from '../FoodOverview';

// Check current component against its snapshot
test('FoodOverview matches previous snapshot', () => {
  const tree = renderer.create(<FoodOverview />).toJSON();
  expect(tree).toMatchSnapshot();
});
