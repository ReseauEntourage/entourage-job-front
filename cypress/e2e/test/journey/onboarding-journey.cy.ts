// to be updated in other tests format

describe('Onboarding', () => {
  beforeEach(() => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', '1234');
    window.localStorage.setItem('release-version', 'v100');
    cy.visit(`/backoffice/dashboard`);
  });

  it('should complete onboarding', () => {
    // first interception: without onboarding infos
    cy.intercept('GET', '/auth/current', {
      fixture: 'auth-current-candidat-onboarding0-res',
    });

    // need of fixture content to fill the forms
    cy.fixture('auth-current-candidat-onboarding3-res').then((user) => {
      /**
       * Step 1: Ethics charter
       */
      // The onboarding should be displayed
      cy.get('#form-onboarding-ethics-charter').should('be.visible');

      // Accept the ethics charter
      cy.get(
        'label[for="form-onboarding-ethics-charter-hasAcceptedEthicsCharter"]'
      ).click();

      // intercept the PUT request to update the user profile
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        fixture: 'auth-current-candidat-onboarding2-res',
      });

      // intercept the PUT request to update the user profile
      cy.intercept('POST', `/readDocuments/read/${user.id}`, {
        fixture: 'user-read-document-ethics-charter',
      });

      // Click on the button to confirm the form
      cy.get(
        '[data-testid="form-confirm-form-onboarding-ethics-charter"]'
      ).click();

      /**
       * Step 2: User social situation
       */
      cy.intercept('PUT', `/users/social-situations/${user.id}`, {
        statusCode: 200,
      });

      cy.get(
        '[data-testid="form-confirm-form-onboarding-candidate-social-situation"]'
      ).click();

      /**
       * Step 3: Profile (with description)
       */

      cy.get('[data-testid="form-onboarding-profile-description"]').type(
        user.userProfile.description
      );

      // intercept requests
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        fixture: 'auth-current-candidat-onboarding3-res',
      });

      // confirm step
      cy.get('[data-testid="form-confirm-form-onboarding-profile"]').click();

      // intercept requests
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        fixture: 'auth-current-candidat-onboarding3-res',
      });
      cy.intercept('GET', '/auth/current', {
        fixture: 'auth-current-candidat-onboarding3-res',
      });

      /**
       * Step 4: Job (linkedin and external cv)
       */
      // confirm step
      cy.get(
        '[data-testid="form-confirm-form-onboarding-candidate-job"]'
      ).click();

      // dashboard should be updated
      cy.contains('Préparer un entretien').should('be.visible'); // to do: get the label from the constants with "findConstantFromValue" utils
      cy.contains(user.userProfile.description).should('be.visible');
    });
  });
});
