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
export const coachExtRequests = {
  GET: [
    {
      path: '/auth/current',
      data: { fixture: 'api/coach-login' },
      alias: 'authCheck',
    },
    // { path: '/cv/shares', data: { total: 10000 }, alias: 'cvShares' },
  ],
  POST: [],
  PUT: [],
};
