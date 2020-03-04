import React from 'react';
import NoInternet from '../NoInternet';

import renderer from 'react-test-renderer';

test('NoInternet matches previous snapshot', () => {
  const tree = renderer.create(<NoInternet />).toJSON();
  expect(tree).toMatchSnapshot();
});

