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
export const visitorRequests = {
  GET: [
    {
      path: '/cv/shares',
      data: { total: 10000 },
      alias: 'cvShares',
    },
    {
      path: '/cv/cards/random?nb=9&gender[]=1',
      data: {
        statusCode: 200,
      },
    },
    {
      path: '/cv/cards/random?nb=9&employed[]=false',
      data: {
        statusCode: 200,
      },
      alias: 'cvCardsRandom',
    },
    {
      path: '/cv/cards/random?nb=3&employed[]=false&employed[]=true',
      data: {
        statusCode: 200,
      },
      alias: 'cvCardsRandom',
    },
    {
      path: '/cv/published',
      data: {
        statusCode: 200,
      },
    },
  ],
  POST: [],
  PUT: [],
};
