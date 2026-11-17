import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { wizardJourneyRequests } from '../e2e/intercept/journey/wizard.req';
import bootstrap from '../e2e/test/bootstrap';

describe("Inscription d'un référent : email déjà utilisé", () => {
  bootstrap();

  it("message d'erreur avec le lien de connexion, boutons actifs", () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');

    wizardJourneyRequests.GET.forEach((request) => {
      cy.intercept('GET', request.path, request.data);
    });
    interceptCurrentUserSubResources();
    // Visitor: there is no current user.
    cy.intercept('GET', '/current', { statusCode: 401 });
    // The email is already used by an existing account.
    cy.intercept('POST', '/users/registration', { statusCode: 409 }).as(
      'postRegistration'
    );

    cy.visit('/wizard');
    cy.get('[data-testid="wizard-flow-selection-referer"]')
      .should('be.visible')
      .click();
    cy.contains('button', "Commencer l'inscription").click();
    cy.url().should('include', '/wizard/run');

    cy.get('[data-testid="form-registration-account-firstName"]').type('Jane');
    cy.get('[data-testid="form-registration-account-lastName"]').type('Doe');
    cy.get('#form-registration-account-phone').type('0698754321');
    cy.get('#form-registration-account-email').type('janedoe@asso.org');
    cy.get('#form-registration-account-department')
      .click()
      .find('.Select__option')
      .contains('Paris')
      .click();

    cy.fixture('api/generated/organizations').then((organizations) => {
      const firstOrganization = organizations[0];
      cy.get('#form-registration-account-organizationId')
        .should('be.visible')
        .type(firstOrganization.name);
      cy.get('#form-registration-account-organizationId')
        .find('.Select__menu')
        .should('be.visible')
        .find('.Select__option')
        .contains(firstOrganization.name)
        .click();
    });

    cy.get('[data-testid="form-registration-account-password"]').type(
      'Azerty123!'
    );
    cy.get('[data-testid="form-registration-account-confirmPassword"]').type(
      'Azerty123!'
    );
    cy.get('input[id="form-registration-account-acceptCGU"]').click({
      force: true,
    });
    cy.get('[data-testid="wizard-next-step-btn"]').click();

    cy.wait('@postRegistration');
    // The step is usable again: the next button is no longer stuck on "Chargement...".
    cy.get('[data-testid="wizard-next-step-btn"]').should('not.be.disabled');
    cy.contains('vous connecter').should('be.visible');

    cy.capture('Référent : email déjà utilisé', {
      caption:
        "Le message sous le champ email propose de se connecter, et « Suivant » est de nouveau actif après l'échec.",
    });
  });
});
