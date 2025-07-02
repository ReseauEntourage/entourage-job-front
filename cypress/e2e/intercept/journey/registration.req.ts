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
export const registrationJourneyRequests = {
  GET: [
    {
      path: '/business-sectors*',
      data: { fixture: 'api/generated/business-sectors' },
      alias: 'businessSectors',
    },
    {
      path: '/nudges*',
      data: { fixture: 'api/generated/nudges' },
      alias: 'nudges',
    },
    {
      path: '/organization?**',
      data: { fixture: 'api/generated/organizations' },
      alias: 'organizationSearch',
    },
  ] as RequestConfig[],
};
