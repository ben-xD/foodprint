import React from 'react';
import Renderer from 'react-test-renderer';
import Onboarding from '../Onboarding';

test('matches snapshot', async () => {
  const result = Renderer.create(<Onboarding />);

  expect(result.toJSON()).toMatchSnapshot();
});
