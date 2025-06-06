import { RequestConfig } from './request.types';

/**
 * Objets représentant des requêtes API pour les tests Cypress.
 *
 * Chaque objet contient les détails d'une requête API HTTP, y compris le chemin,
 * les données de réponse simulées et un alias facultatif pour une utilisation ultérieure dans Cypress.
 *
 * {
 *    method: string,       // Méthode HTTP (par exemple, 'GET', 'POST')
 *    path: string,         // Chemin de l'URL de l'API
 *    data?: object,        // Données de réponse simulées
 *    alias?: string,       // Alias pour référencer cette requête dans Cypress
 * }
 */
export const guideJourneyRequests = {
  POST: [
    {
      path: '/contact/candidate',
      data: {
        statusCode: 201,
      },
      alias: 'postCandidateContact',
    },
    {
      path: '/contact/contactUs',
      data: {
        statusCode: 201,
      },
      alias: 'postContact',
    },
  ] as RequestConfig[],
  PUT: [] as RequestConfig[],
  GET: [] as RequestConfig[],
};
