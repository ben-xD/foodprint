import React from 'react';
import Email from '../Email';

import renderer from 'react-test-renderer';

test('Email renders correctly and is the same as its previous snapshot', () => {
  const tree = renderer.create(<Email/>).toJSON();
  expect(tree).toMatchSnapshot();
});

