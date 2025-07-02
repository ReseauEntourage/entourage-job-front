import { data } from 'cypress/types/jquery';
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
  ] as RequestConfig[],
  POST: [] as RequestConfig[],
  PUT: [] as RequestConfig[],
};
