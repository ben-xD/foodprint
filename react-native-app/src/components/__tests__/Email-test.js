import React from 'react';
import Email from '../Email';

import renderer from 'react-test-renderer';

test('Email matches previous snapshot', () => {
  const tree = renderer.create(<Email />).toJSON();
  expect(tree).toMatchSnapshot();
});

