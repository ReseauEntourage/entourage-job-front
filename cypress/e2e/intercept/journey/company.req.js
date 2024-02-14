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
export const companyJourneyRequests = {
  GET: [
    { path: '/cv/shares', data: { total: 10000 }, alias: 'cvShares' },
    {
      path: '/cv/cards/random?nb=3&employed[]=false&employed[]=true',
      data: { fixture: 'api/cv-cards' },
      alias: 'cvCardsRandom',
    },
  ],
  POST: [
    {
      path: '/contact/company',
      data: {
        statusCode: 201,
      },
      alias: 'postContactCompany',
    },
    {
      path: '/opportunity',
      data: {
        statusCode: 201,
      },
      alias: 'postOpportunity',
    },
  ],
  PUT: [],
};
