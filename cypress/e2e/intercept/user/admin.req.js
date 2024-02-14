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
    { path: '/cv/shares', data: { total: 10000 }, alias: 'cvShares' },
    {
      path: '/user/members/count',
      data: { pendingCVs: 0 },
      alias: 'membersCount',
    },
    {
      path: '/auth/current',
      data: { fixture: 'api/admin-login' },
      alias: 'authCheck',
    },
    {
      path: '/opportunity/admin**',
      data: { fixture: 'api/opportunities' },
      alias: 'opportunities',
    },
    {
      path: '/user/members*',
      data: { fixture: 'api/users-candidat' },
      alias: 'candidates',
    },
    // la creation de membre est tricky - de nombreux type sont créés
    // soit un candidat et un candidat externe
    // soit un coach et un coach externe
    {
      path: '/user/search?**',
      data: {
        fixture: 'api/search-user',
      },
      alias: 'userSearch',
    },
    {
      path: '/organization?**',
      data: { fixture: 'api/organizations' },
      alias: 'organizationSearch',
    },
    {
      path: '/organization?search=&limit=50&offset=0',
      data: { fixture: 'api/organizations' },
      alias: 'organizations',
    },
    // ICI NOUS COMPRENONS QUE LES FIXTURES SONT IDENTIQUES POUR CES ROUTES
    // {
    //   path: '/user/search?query=John&role=Coach',
    //   path: `/user/search?query=John&role=Coach+externe&organizationId=${entourageOrganizationId}`,
    //   path: '/user/search?query=Jane&role=Candidat',
    //   path: `/user/search?query=Jane&role=Candidat+externe&organizationId=${entourageOrganizationId}`
    //   data: {
    //     fixture: 'user-admin-coaches-search-res', // LA DATA EST IDENTIQUE POUR CES 2 FICHIERS JSON.
    //     fixture: 'user-admin-candidates-search-res',
    //   },
    //   alias: 'getNormalCoachesJohn',
    //   alias: 'getNormalCandidatesJane',
    //   alias: 'getExternalCoachesJohn',
    //   alias: 'getExternalCandidatesJane',
    // },
    // ICI AUSSI, NOUS COMPRENONS QUE LES FIXTURES SONT IDENTIQUES POUR CES ROUTES
    // {
    //   path: '/organization?limit=50&offset=0&zone[]=LYON',
    //   path: '/organization?limit=50&offset=0',
    //   path: '/organization?search=Entourage&limit=50&offset=0',
    //   path: '/organization?search=&limit=50&offset=0',
    //   data: {
    //     fixture: 'organization-search-res',
    //   },
    //   alias: 'organizationListPage',
    //   alias: 'searchOrganizationsListUpdateCreate',
    //   alias: 'getOrganizationListUpdateCreate',
    // },
  ],
  // To create
  POST: [
    {
      path: '/opportunity',
      data: {
        statusCode: 201,
      },
      alias: 'postOpportunity',
    },
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
