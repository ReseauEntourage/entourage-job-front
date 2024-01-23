/* eslint-disable no-undef */
import bootstrap from '../bootstrap';
import { worksJourneyRequests } from '../../intercept/journey/works.req.js';

describe('En tant que - Candidat (en recherche)', () => {
  beforeEach(() => {
    /**
     * Intercept GET requests
     */
    worksJourneyRequests.GET.map((request) => {
      if (request.alias)
        cy.intercept('GET', request.path, request.data).as(request.alias);
      else cy.intercept('GET', request.path, request.data);
    });
    /**
     * Intercept POST requests
     */
    worksJourneyRequests.POST.map((request) => {
      if (request.alias)
        cy.intercept('POST', request.path, request.data).as(request.alias);
      else cy.intercept('POST', request.path, request.data);
    });
    /**
     * Intercept PUT requests
     */
    worksJourneyRequests.PUT.map((request) => {
      if (request.alias)
        cy.intercept('PUT', request.path, request.data).as(request.alias);
      else cy.intercept('PUT', request.path, request.data);
    });
  });

  /**
   * Je rejoins Linkedout
   */
  describe('Je souhaite rejoindre LinkedOut', () => {
    // J'accède a la page /travailler
    it("J'accède à la page /travailler", () => {
      cy.visit('/travailler', {});
      // j'attend 0.5sec
      cy.wait(500);
    });

    it("J'affiche, remplis et valide le formulaire pour travailler", () => {
      cy.get('[data-testid="banner-cta"]').first().click();

      cy.get('.ReactModalPortal div').first().should('be.visible');
      cy.get('[data-testid="form-candidate-inscription-location"]').click();

      cy.get('[data-testid="select-option-93"]').click();

      cy.get('[data-testid="form-candidate-inscription-birthdate"]').type(
        '1996-02-22'
      );

      cy.get('[data-testid="form-candidate-inscription-workingRight"]').click();

      cy.get('[data-testid="select-option-yes"]').click();

      cy.get('[data-testid="form-candidate-inscription-firstName"]').type(
        'John'
      );

      cy.get('[data-testid="form-candidate-inscription-lastName"]').type('Doe');

      cy.get('[data-testid="form-candidate-inscription-phone"]').type(
        '0698754321'
      );

      cy.get('[data-testid="form-candidate-inscription-email"]').type(
        'test@gmail.com'
      );

      cy.get('[data-testid="form-candidate-inscription-heardAbout"]').click();

      cy.get('[data-testid="select-option-linkedin"]').click();

      // cy.get(
      //   '[data-testid="form-candidate-inscription-infoCoSubtitle"]'
      // ).should('include.text', Cypress.env('adresseLocauxParis'));

      // cy.get('[data-testid="infoco-radio-5"]').click();

      cy.get('.ReactModalPortal div')
        .find('button')
        .contains('Valider')
        .should('be.visible')
        .click();

      cy.wait('@postInscription');

      cy.get('.ReactModalPortal div')
        .find('button')
        .contains('Fermer')
        .should('be.visible')
        .click();

      cy.get('.ReactModalPortal div').should('not.exist');
    });
  });
});
