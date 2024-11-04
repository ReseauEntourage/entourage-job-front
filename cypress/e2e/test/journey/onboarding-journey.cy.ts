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
      // first step: help needs
      cy.get(
        `[data-testid="form-onboarding-candidate-helps-helpNeeds-${user.userProfile.helpNeeds[0].name}"]`
      ).click();

      // intercept the PUT request to update the user profile
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        fixture: 'auth-current-candidat-onboarding1-res',
      });

      // submit first step
      cy.get(
        '[data-testid="form-confirm-form-onboarding-candidate-helps"]'
      ).click();

      // label in the select differs from the fixture
      cy.get('#form-onboarding-candidate-job-searchBusinessLine0')
        .click()
        .find('.Select__option')
        .contains('Agriculture')
        .click();

      // intercept the PUT request to update the user profile
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        fixture: 'auth-current-candidat-onboarding2-res',
      });

      // submit second step
      cy.get(
        '[data-testid="form-confirm-form-onboarding-candidate-job"]'
      ).click();

      // fill description
      cy.get('[data-testid="form-onboarding-profile-description"]').type(
        user.userProfile.description
      );

      // intercept requests
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        fixture: 'auth-current-candidat-onboarding3-res',
      });
      cy.intercept('GET', '/auth/current', {
        fixture: 'auth-current-candidat-onboarding3-res',
      });

      // confirm final step
      cy.get('[data-testid="form-confirm-form-onboarding-profile"]').click();

      // dashboard should be updated
      cy.contains('Préparer un entretien').should('be.visible'); // to do: get the label from the constants with "findConstantFromValue" utils
      cy.contains(user.userProfile.description).should('be.visible');
    });
  });
});
