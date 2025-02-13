import { guideJourneyRequests } from '../../intercept/journey/guide.req';
import bootstrap from '../bootstrap';

describe('En tant que - Benevole', () => {
  /**
   * Nous générons toutes les fixtures
   */
  bootstrap();

  /**
   * À chaque fois:
   * - s'assurer que la modale ne s'affiche pas
   * - interceptions de multiple requêtes API (GET, POST, PUT)
   */
  beforeEach(() => {
    /**
     * Remove modal
     */
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');

    /**
     * Intercept requests
     */
    guideJourneyRequests.POST.forEach((request) => {
      if (request.alias) {
        cy.intercept('POST', request.path, request.data).as(request.alias);
      } else cy.intercept('POST', request.path, request.data);
    });

    cy.visit('/orienter');
  });

  /**
   * Je souhaite contacter l'association
   */
  describe("Je souhaite contacter l'association", () => {
    it("J'affiche, remplis et valide le formulaire de contacte", () => {
      cy.get('[data-testid="button-contact"]').first().click();

      cy.get('.ReactModalPortal div').first().should('be.visible');

      cy.get('#form-interest-lastName').type('Doe');

      cy.get('#form-interest-firstName').type('John');

      cy.get('#form-interest-email').type('johndoe@gmail.com');

      cy.get('#form-interest-phone').type('0698754321');

      cy.get('#form-interest-structure').type('Test');

      cy.get('#form-interest-message').type('Form test');

      cy.get('#form-interest-heardAbout-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Autre')
        .click();

      cy.get('label[for="form-interest-cgu"]').click();

      cy.get('button').contains('Envoyer').click();

      cy.wait('@postContact');

      cy.get('[data-testid="success-modal-content"]').should('be.visible');

      cy.get('[data-testid="success-close-modal"]').click();

      cy.get('[data-testid="success-modal-content"]').should('not.exist');
    });
  });
});
