import React from 'react';
import Renderer from 'react-test-renderer';
import CarbonFootprintScore from '../CarbonFootprintScore';


const mockedHistoryReport = {
  userAvg: 17.25,
};

test('matches snapshot', async () => {
  const result = Renderer.create(<CarbonFootprintScore historyReport={mockedHistoryReport} />);

  expect(result.toJSON()).toMatchSnapshot();
});
