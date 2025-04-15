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
export const adminRequests = {
  // To read
  GET: [
    // { path: '/cv/shares', data: { total: 10000 }, alias: 'cvShares' },
    {
      path: '/auth/current',
      data: { fixture: 'api/generated/admin-login' },
      alias: 'authCheck',
    },
    {
      path: '/user/members*',
      data: { fixture: 'api/generated/users-candidat' },
      alias: 'candidates',
    },
    // la creation de membre est tricky - de nombreux type sont créés
    // soit un candidat et un candidat externe
    // soit un coach et un coach externe
    {
      path: '/user/search?**',
      data: {
        fixture: 'api/generated/search-user',
      },
      alias: 'userSearch',
    },
    {
      path: '/organization?**',
      data: { fixture: 'api/generated/organizations' },
      alias: 'organizationSearch',
    },
    {
      path: '/organization?search=&limit=50&offset=0',
      data: { fixture: 'api/generated/organizations' },
      alias: 'organizations',
    },
  ],
  // To create
  POST: [
    {
      path: '/user',
      data: {
        statusCode: 201,
      },
      alias: 'postCandidate',
    },
    {
      path: '/organization',
      data: {
        statusCode: 201,
      },
      alias: 'postOrganization',
    },
  ],
  // To update
  PUT: [
    {
      path: `/organization/*`,
      data: {
        statusCode: 200,
      },
      alias: 'putOrganization',
    },
  ],
};
