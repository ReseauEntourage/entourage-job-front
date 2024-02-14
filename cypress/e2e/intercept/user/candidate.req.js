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
export const candidateRequests = (user) => {
  return {
    GET: [
      { path: '/cv/shares', data: { total: 10000 }, alias: 'cvShares' },
      {
        path: '/auth/current',
        data: { fixture: 'api/coach-login' },
        alias: 'authCheck',
      },
      {
        path: `/opportunity/candidate/count/${user.id}`,
        data: { unseenOpportunities: 0 },
        alias: 'userCount',
      },
      {
        path: `/cv/${user.id}`,
        data: { fixture: 'api/cv-candidate' },
        alias: 'cvCandidate',
      },
      {
        path: `/opportunity/candidate/all/${user.id}*`,
        data: { fixture: 'api/opportunities-wrapped' },
        alias: 'opportunitiesWrapped',
      },
      {
        path: `opportunity/candidate/tabCount/${user.id}`,
        data: { fixture: 'api/tab-count' },
        alias: 'tabCount',
      },
      {
        path: `/cv/read/${user.id}`,
        data: { fixture: 'api/cv-candidate' },
        alias: 'cvCandidateDetails',
      },
      {
        path: `/user/${user.id}`,
        data: { fixture: 'api/candidate-login' },
      },
      {
        path: `/cv/lastVersion/${user.id}`,
        data: { fixture: 'api/cv-candidate' },
      },
      {
        path: `/user/candidate/checkUpdate/${user.id}`,
        data: { noteHasBeenModified: true },
        alias: 'candidate-update',
      },
      {
        path: `/cv/checkUpdate/${user.id}`,
        data: { cvHasBeenModified: true },
        alias: 'cv-update',
      },
      {
        path: `https://tarteaucitron.io/load.js*`,
        data: {},
      },
    ],
    POST: [
      {
        path: `/cv/${user.id}`,
        data: { fixture: 'api/cv-candidate' },
        alias: 'postCvCandidate',
      },
      {
        path: `/user/profile/uploadImage/${user.id}`,
        data: '/assets/image-fixture.jpg',
        alias: 'uploadImage',
      },
      {
        path: '/opportunity/external',
        data: {},
        alias: 'postExternal',
      },
    ],
    PUT: [
      {
        path: `/cv/${user.id}`,
        data: { fixture: 'api/cv-candidate' },
        alias: 'putCvCandidate',
      },
      {
        path: `/cv/read/${user.id}`,
        data: { fixture: 'api/cv-candidate' },
        alias: 'putCvCandidate',
      },
      // {
      //   path: `/user/candidate/${user.id}`,
      //   data: { fixture: 'api/put-candidate' },
      //   alias: 'putUserCandidatParams',
      // },
      // {
      //   path: `/user/${user.id}`,
      //   data: { fixture: 'api/put-candidate' },
      //   alias: 'putUserParams',
      // },
      {
        path: '/user/changePwd',
        data: {},
        alias: 'changePwd',
      },
    ],
  };
};

// cy.fixture('user-opportunity-all-res').then((offersRes) => {
//   cy.intercept(
//     `opportunity/${offersRes.offers[0].id}`,
//     offersRes.offers[0]
//   ).as('getOneOffer');

//   const opportunityToModify = offersRes.offers[0];

//   opportunityToModify.bookmarked = false;

//   cy.intercept(
//     'PUT',
//     `opportunity/join/${offersRes.offers[0].id}/${user.id}`,
//     opportunityToModify
//   ).as('putOffer');
// });
