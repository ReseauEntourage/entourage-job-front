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
export const cvJourneyRequests = {
  // cy.intercept('GET', '/user/search/candidates*', {
  //   fixture: userSearchCandidatesResponses(10),
  // }).as('getCandidats');

  // cy.intercept('GET', '/cv/shares', { total: 184222 }).as('cvShares');
  // cy.intercept('GET', '/cv/published', { nbPublishedCVs: 2 }).as(
  //   'cvPublished'
  // );

  GET: [
    { path: '/cv/shares', data: { total: 10000 }, alias: 'cvShares' },
    {
      path: '/cv/published',
      data: { nbPublishedCVs: 2 },
      alias: 'cvPublished',
    },
    {
      path: '/cv/*',
      data: { fixture: 'api/generated/cv-candidate' },
      alias: 'cvCandidate',
    },
    {
      path: '/auth/current',
      data: { fixture: 'api/generated/coach-login' },
      alias: 'authCheck',
    },
    {
      path: '/cv/cards/random*',
      data: { fixture: 'api/generated/cv-cards' },
      alias: 'getAllCV',
    },
  ],
  POST: [
    {
      path: '/opportunity',
      data: { fixture: 'api/generated/opportunity' },
      alias: 'postOpportunity',
    },

    {
      path: '/cv/count',
      data: {},
      alias: 'postCvCount',
    },
    {
      path: '/message/external',
      data: { fixture: 'api/generated/post-external-message-res' },
      alias: 'postMessage',
    },
    {
      path: '/user/search/candidates*',
      data: { fixture: 'api/generated/post-external-message-res' },
      alias: 'postMessage',
    },
  ],
  PUT: [],
};
