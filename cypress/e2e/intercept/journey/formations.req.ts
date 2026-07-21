import { RequestConfig } from './request.types';

/**
 * Objets représentant des requêtes API pour les tests Cypress de la page Formations.
 *
 * Chaque objet contient les détails d'une requête API HTTP, y compris le chemin,
 * les données de réponse simulées et un alias facultatif pour une utilisation ultérieure dans Cypress.
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
