// to be updated in other tests format

describe('Inscription', () => {
  describe('Candidate', () => {
    it('should complete registration', () => {
      window.localStorage.setItem('entourage-pro-modal-closed', 'true');
      cy.intercept('POST', '/user/registration', {
        statusCode: 201,
      }).as('postRegistration');

      cy.visit('/inscription');
      cy.url().should('include', 'step-1');

      cy.get('[data-testid="form-registration-role-role-Candidat"]').click();
      cy.contains('Suivant').click();
      cy.url().should('include', 'step-2');
      cy.get(
        '[data-testid="form-registration-candidate-expectations-nudge-0"]'
      ).click();
      cy.contains('Suivant').click();

      cy.get('[data-testid="form-registration-candidate-info-birthDate"]').type(
        '1990-01-01'
      );
      cy.get('#form-registration-candidate-info-department')
        .click()
        .find('.Select__option')
        .contains('Paris')
        .click();
      cy.get('[data-testid="working-right-yes"]').click();
      cy.get('[data-testid="material-insecurity-yes"]').click();
      cy.get('[data-testid="network-insecurity-no"]').click();
      cy.contains('Suivant').click();

      cy.get(
        "[data-testid='form-registration-candidate-professional-information-businessSector0']"
      )
        .click()
        .find('.Select__option')
        .contains('Agriculture')
        .click();
      cy.contains('Suivant').click();

      cy.get('[data-testid="form-registration-account-firstName"]').type(
        'John'
      );
      cy.get('[data-testid="form-registration-account-lastName"]').type('Doe');
      cy.get('[data-testid="form-registration-account-gender"]')
        .click()
        .get('[data-testid="select-option-0"]')
        .click();
      cy.get('#form-registration-account-email').type('johndoe@gmail.com');
      cy.get('#form-registration-account-phone').type('0698754321');

      cy.get('[data-testid="form-registration-account-password"]').type(
        'Azerty123!'
      );

      cy.get('[data-testid="form-registration-account-confirmPassword"]').type(
        'Azerty123!'
      );

      cy.get('input[id="form-registration-account-acceptCGU"]').click({
        force: true,
      });

      cy.contains('Suivant').click();
      cy.url().should('include', 'confirmation');
      cy.url().should('include', 'Candidat');
      cy.url().should('include', 'boost');
    });
  });

  describe('Prescripteur', () => {
    it('should complete registration', () => {
      window.localStorage.setItem('entourage-pro-modal-closed', 'true');

      // Intercept the requests
      cy.intercept('POST', '/user/registration', {
        statusCode: 201,
      }).as('postRegistration');
      cy.intercept('GET', '/organization?**', {
        fixture: 'api/generated/organizations',
      }).as('organizationSearch');

      // Access the registration page
      cy.visit('/inscription');
      cy.url().should('include', 'step-1');

      // Select the role "Prescripteur" and go to the next step
      cy.get(
        '[data-testid="form-registration-role-role-Prescripteur"]'
      ).click();
      cy.contains('Suivant').click();

      // Check that the URL now includes "step-2"
      cy.url().should('include', 'step-2');

      // Fill the form with the Prescripteur's expectations and go to the next step
      cy.get('[data-testid="form-registration-account-firstName"]').type(
        'John'
      );
      cy.get('[data-testid="form-registration-account-lastName"]').type('Doe');
      cy.get('#form-registration-account-phone').type('0698754321');
      cy.get('#form-registration-account-email').type('johndoe@gmail.com');

      cy.get('#form-registration-account-department')
        .click()
        .find('.Select__option')
        .contains('Paris')
        .click();

      cy.get('#form-registration-account-organizationId').should('be.visible');

      // Load the organizations and select the first one
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

      // Fill the password fields and go to the next step
      cy.get('[data-testid="form-registration-account-password"]').type(
        'Azerty123!'
      );
      cy.get('[data-testid="form-registration-account-confirmPassword"]').type(
        'Azerty123!'
      );

      cy.get('input[id="form-registration-account-acceptCGU"]').click({
        force: true,
      });

      // Go to the next step and check that the URL now includes "confirmation" and "Prescripteur"
      cy.contains('Suivant').click();
      cy.url().should('include', 'confirmation');
      cy.url().should('include', 'Prescripteur');
    });
  });
});
