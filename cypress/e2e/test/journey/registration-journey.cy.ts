import { registrationJourneyRequests } from '../../intercept/journey/registration.req';
import bootstrap from '../bootstrap';

describe('Registration', () => {
  /**
   * Generate fixtures
   */
  bootstrap();

  /**
   * Interceptions
   */
  beforeEach(() => {
    /**
     * Remove modals
     */
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', '1234');
    window.localStorage.setItem('release-version', 'v100');

    registrationJourneyRequests.GET.forEach((request) => {
      if (request.alias) {
        cy.intercept('GET', request.path, request.data).as(request.alias);
      } else cy.intercept('GET', request.path, request.data);
    });

    cy.intercept('POST', '/user/registration', {
      statusCode: 201,
    }).as('postRegistration');
  });

  describe('Etant donné que je suis un visiteur', () => {
    describe("Quand je visite la page d'inscription", () => {
      beforeEach(() => {
        cy.visit('/inscription');
      });

      it('should display the registration page', () => {
        cy.url().should('include', '/inscription');
        cy.contains('Inscription');
      });

      it('should be able to select the role "Candidat"', () => {
        cy.get('[data-testid="form-registration-role-role-Candidat"]')
          .should('be.visible')
          .click();
        cy.contains('Suivant').click();
        cy.url().should('include', 'step-2');
      });

      it('should be able to select the role "Coach"', () => {
        cy.get('[data-testid="form-registration-role-role-Coach"]')
          .should('be.visible')
          .click();
        cy.contains('Suivant').click();
        cy.url().should('include', 'step-2');
      });

      it('should be able to select the role "Prescripteur"', () => {
        cy.get('[data-testid="form-registration-role-role-Prescripteur"]')
          .should('be.visible')
          .click();
        cy.contains('Suivant').click();
        cy.url().should('include', 'step-2');
      });

      describe('Etant donné que je souhaite devenir un candidat', () => {
        beforeEach(() => {
          cy.get('[data-testid="form-registration-role-role-Candidat"]')
            .should('be.visible')
            .click();
          cy.contains('Suivant').click();
        });
        it('should be able to fill the candidate registration form', () => {
          cy.url().should('include', 'step-2');

          cy.wait('@nudges');
          // Fill the candidate expectations
          cy.get(
            '[data-testid="form-registration-candidate-expectations-nudgeIds"]'
          )
            .should('be.visible')
            .first() // Select the first nudge
            .click();
          cy.contains('Suivant').click();

          // Fill the candidate info
          cy.get(
            '[data-testid="form-registration-candidate-info-birthDate"]'
          ).type('1990-01-01');
          cy.get('#form-registration-candidate-info-department')
            .click()
            .find('.Select__option')
            .contains('Paris')
            .click();
          cy.get('[data-testid="working-right-yes"]').click();
          cy.get('[data-testid="material-insecurity-yes"]').click();
          cy.get('[data-testid="network-insecurity-no"]').click();
          cy.contains('Suivant').click();

          // Fill the professional information
          cy.get(
            '#form-registration-candidate-professional-information-businessSectorId0'
          ).click();
          cy.wait('@businessSectors');
          cy.get(
            '#form-registration-candidate-professional-information-businessSectorId0'
          )
            .find('.Select__option')
            .contains('Sector 1')
            .click();
          cy.contains('Suivant').click();

          // Fill the account information
          cy.get('[data-testid="form-registration-account-firstName"]').type(
            'John'
          );
          cy.get('[data-testid="form-registration-account-lastName"]').type(
            'Doe'
          );
          cy.get('[data-testid="form-registration-account-gender"]')
            .click()
            .get('[data-testid="select-option-0"]')
            .click();
          cy.get('#form-registration-account-email').type('johndoe@gmail.com');
          cy.get('#form-registration-account-phone').type('0698754321');

          cy.get('[data-testid="form-registration-account-password"]').type(
            'Azerty123!'
          );

          cy.get(
            '[data-testid="form-registration-account-confirmPassword"]'
          ).type('Azerty123!');

          cy.get('input[id="form-registration-account-acceptCGU"]').click({
            force: true,
          });

          cy.contains('Suivant').click();
          cy.url().should('include', 'confirmation');
          cy.url().should('include', 'Candidat');
        });
      });

      describe('Etant donné que je souhaite devenir un Prescripteur', () => {
        beforeEach(() => {
          cy.get('[data-testid="form-registration-role-role-Prescripteur"]')
            .should('be.visible')
            .click();
          cy.contains('Suivant').click();
        });

        it('should be able to fill the Prescripteur registration form', () => {
          cy.url().should('include', 'step-2');

          // Fill the account information
          cy.get('[data-testid="form-registration-account-firstName"]').type(
            'John'
          );
          cy.get('[data-testid="form-registration-account-lastName"]').type(
            'Doe'
          );

          cy.get('#form-registration-account-phone').type('0698754321');

          cy.get('#form-registration-account-email').type('johndoe@gmail.com');

          cy.get('#form-registration-account-department')
            .click()
            .find('.Select__option')
            .contains('Paris')
            .click();

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

          cy.get('[data-testid="form-registration-account-password"]').type(
            'Azerty123!'
          );

          cy.get(
            '[data-testid="form-registration-account-confirmPassword"]'
          ).type('Azerty123!');

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
  });
});
