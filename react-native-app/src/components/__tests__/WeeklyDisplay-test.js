import React from 'react';
import Renderer from 'react-test-renderer';
import WeeklyDisplay from '../WeeklyDisplay';


const mockedHistoryReport = {
  userAvg: 17.25,
  periodAvgs: [13.4, 64],
  categoryReports: [
    {
      plantBased: [
        { 'periodNumber': 0, 'avgCarbonFootprint': 3.8 },
        { 'periodNumber': -1, 'avgCarbonFootprint': 2.7 },
        { 'periodNumber': -2, 'avgCarbonFootprint': 3.3 },
        { 'periodNumber': -3, 'avgCarbonFootprint': 2.85 },
        { 'periodNumber': -4, 'avgCarbonFootprint': 2.6 },
        { 'periodNumber': -5, 'avgCarbonFootprint': 3.3 },
      ],
      fish: [
        { 'periodNumber': 0, 'avgCarbonFootprint': 3.8 },
        { 'periodNumber': -1, 'avgCarbonFootprint': 2.6 },
        { 'periodNumber': -2, 'avgCarbonFootprint': 3.3 },
        { 'periodNumber': -3, 'avgCarbonFootprint': 2.7 },
        { 'periodNumber': -4, 'avgCarbonFootprint': 2.85 },
        { 'periodNumber': -5, 'avgCarbonFootprint': 2.6 },
      ],
      meat: [
        { 'periodNumber': 0, 'avgCarbonFootprint': 3.8 },
        { 'periodNumber': -1, 'avgCarbonFootprint': 3.3 },
        { 'periodNumber': -2, 'avgCarbonFootprint': 2.85 },
        { 'periodNumber': -3, 'avgCarbonFootprint': 2.6 },
        { 'periodNumber': -4, 'avgCarbonFootprint': 2.7 },
        { 'periodNumber': -5, 'avgCarbonFootprint': 3.3 },
      ],
      eggsAndDairy: [
        { 'periodNumber': 0, 'avgCarbonFootprint': 3.8 },
        { 'periodNumber': -1, 'avgCarbonFootprint': 3.3 },
        { 'periodNumber': -2, 'avgCarbonFootprint': 2.85 },
        { 'periodNumber': -3, 'avgCarbonFootprint': 2.6 },
        { 'periodNumber': -4, 'avgCarbonFootprint': 2.7 },
        { 'periodNumber': -5, 'avgCarbonFootprint': 2.6 },
      ],
    },
    {
      plantBased: [
        { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
        { 'periodNumber': -1, 'avgCarbonFootprint': 19.00 },
        { 'periodNumber': -2, 'avgCarbonFootprint': 16.50 },
        { 'periodNumber': -3, 'avgCarbonFootprint': 14.25 },
        { 'periodNumber': -4, 'avgCarbonFootprint': 13.00 },
        { 'periodNumber': -5, 'avgCarbonFootprint': 16.50 },
      ],
      fish: [
        { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
        { 'periodNumber': -1, 'avgCarbonFootprint': 13.00 },
        { 'periodNumber': -2, 'avgCarbonFootprint': 16.50 },
        { 'periodNumber': -3, 'avgCarbonFootprint': 19.00 },
        { 'periodNumber': -4, 'avgCarbonFootprint': 14.25 },
        { 'periodNumber': -5, 'avgCarbonFootprint': 13.00 },
      ],
      meat: [
        { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
        { 'periodNumber': -1, 'avgCarbonFootprint': 16.50 },
        { 'periodNumber': -2, 'avgCarbonFootprint': 19.00 },
        { 'periodNumber': -3, 'avgCarbonFootprint': 13.00 },
        { 'periodNumber': -4, 'avgCarbonFootprint': 14.25 },
        { 'periodNumber': -5, 'avgCarbonFootprint': 16.50 },
      ],
      eggsAndDairy: [
        { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
        { 'periodNumber': -1, 'avgCarbonFootprint': 16.5 },
        { 'periodNumber': -2, 'avgCarbonFootprint': 19 },
        { 'periodNumber': -3, 'avgCarbonFootprint': 13 },
        { 'periodNumber': -4, 'avgCarbonFootprint': 14.25 },
        { 'periodNumber': -5, 'avgCarbonFootprint': 13 },
      ],
    },
  ],
};

test('match snapshot', async () => {
  const result = Renderer.create(<WeeklyDisplay average={mockedHistoryReport.periodAvgs[0]} composition={mockedHistoryReport.categoryReports[0]} />);

  expect(result.toJSON()).toMatchSnapshot();
});

test('Empty history matches snapshot', async () => {
  const result = Renderer.create(<WeeklyDisplay average={mockedHistoryReport.periodAvgs[0]} composition={mockedHistoryReport.categoryReports[0]} />);

  expect(result.toJSON()).toMatchSnapshot();
});
