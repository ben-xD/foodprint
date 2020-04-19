import React from 'react';
import renderer from 'react-test-renderer';
import Recipe, { POST_RECIPE_MUTATION } from '../Recipe';
import { MockedProvider } from '@apollo/react-testing';

const mockedNavigation = {};

const mockedRoute = {};

test('matches snapshot when carbon footprint success', async () => {
  const mockedResponses = [
    {
      request: {
        query: POST_RECIPE_MUTATION,
      },
      result: () => {
        return {
          data: {
            postRecipe: {
              carbonFootprintPerKg: 0.5,
            },
          },
        };
      },
    },
  ];

  const app = renderer.create(
    <MockedProvider mocks={mockedResponses} addTypename={false}>
      <Recipe navigation={mockedNavigation} route={mockedRoute} />
    </MockedProvider>);

  expect(app).toMatchSnapshot();
});


test('matches snapshot when carbon footprint fails', async () => {
  const mockedResponses = [
    {
      request: {
        query: POST_RECIPE_MUTATION,
      },
      result: () => {
        return {
          data: {
            postRecipe: {
              carbonFootprintPerKg: null,
            },
          },
        };
      },
    },
  ];

  const app = renderer.create(
    <MockedProvider mocks={mockedResponses} addTypename={false}>
      <Recipe navigation={mockedNavigation} route={mockedRoute} />
    </MockedProvider>);

  expect(app).toMatchSnapshot();
});
