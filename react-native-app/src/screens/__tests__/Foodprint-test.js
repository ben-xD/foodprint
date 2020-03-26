import React from 'react';

import renderer from 'react-test-renderer';
import Foodprint from '../Foodprint';

// Check current component against its snapshot
test('Foodprint matches previous snapshot', () => {
  const mockedNavigation = {
    setOptions: () => { },
  };
  const tree = renderer.create(<Foodprint navigation={mockedNavigation} />).toJSON();
  expect(tree).toMatchSnapshot();
});
