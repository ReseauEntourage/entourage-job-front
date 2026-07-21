import { RequestConfig } from './request.types';

/**
 * Objects representing API requests for the Formations page Cypress tests.
 *
 * Each object contains the details of an HTTP API request, including the path,
 * the mocked response data, and an optional alias for later use in Cypress.
 */
export const formationsJourneyRequests = {
  GET: [
    {
      path: '/elearning/units*',
      data: { statusCode: 200, body: [] },
      alias: 'elearningUnits',
    },
  ] as RequestConfig[],
  POST: [
    {
      path: '/elearning/units/*/completions',
      data: {
        statusCode: 201,
        body: {
          id: 'elearning-completion-1',
          userId: '4d3c885c-4859-4e7b-a428-902812964f08',
          unitId: 'elearning-unit-1',
          validatedAt: '2026-01-01T00:00:00.000Z',
        },
      },
      alias: 'postElearningCompletion',
    },
  ] as RequestConfig[],
};
