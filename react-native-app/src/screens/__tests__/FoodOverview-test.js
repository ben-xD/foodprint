import React from 'react';

import renderer from 'react-test-renderer';
import FoodOverview from '../FoodOverview';

// Check current component against its snapshot
test('FoodOverview matches previous snapshot', () => {
  const mockedNavigation = {
    setOptions: () => { },
  };
  const tree = renderer.create(<FoodOverview navigation={mockedNavigation} />).toJSON();
  expect(tree).toMatchSnapshot();
});
