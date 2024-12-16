import { data } from 'cypress/types/jquery';

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
export const refererJourneyRequests = {
  GET: [
    {
      path: '/user/profile/refered?offset=0&limit=20',
      data: { fixture: 'api/generated/users-candidat' },
      alias: 'candidates',
    },
    {
      path: '/contact/campaigns/candidate',
      data: { fixture: 'api/generated/campaigns' },
      alias: 'campaigns',
    },
  ],
  POST: [],
  PUT: [],
};
