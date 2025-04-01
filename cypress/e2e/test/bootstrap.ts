/* eslint-disable no-undef */

/**
 * Bootstrap
 */
const bootstrap = () => {
  /**
   * Une fois seulement:
   * - génération les fixtures (fichiers JSON) dans '../fixtures/api/generated/*'
   * - interceptions d'une unique requête "problématiques" (nécessaire pour /login)
   * - affichage de la page login
   */
  before(() => {
    // Nous générons les fixtures via commandes
    cy.log('== Generate API fixtures in JSON files ==');
    cy.generateAdminLoginApiResponse(); // admin-login.json
    cy.generateCandidateLoginApiResponse(); // candidate-login.json
    cy.generateCoachLoginApiResponse(); // coach-login.json

    cy.generateCvCandidateApiResponse(); // cv-candidate.json
    cy.generateCvCardsApiResponse(); // cv-cards.json

    cy.generateSearchUsersApiResponse(); // search-user.json
    cy.generateUserProfileReferedApiResponse(); // user-profile-refered.json
    cy.generateUsersApiResponse('candidat'); // users-candidat.json

    cy.generateOpportunitiesWrappedApiResponse(); // opportunities-wrapped.json

    cy.generateOrganizationsApiResponse(); // organizations.json

    cy.generateTabCountApiResponse(); // tab-count.json

    cy.generateCampaignsApiResponse(); // campaigns.json;
  });
};

export default bootstrap;
