import { companyJourneyRequests } from '../../intercept/journey/company.req';
import bootstrap from '../bootstrap';

describe('En tant que - Employeur/Entreprise - Je veux recruter inclusif', () => {
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
     * Remove modals
     */
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('tax-modal-closed', 'true');

    /**
     * Intercept requests
     */
    companyJourneyRequests.GET.forEach((request) => {
      if (request.alias) {
        cy.intercept('GET', request.path, request.data).as(request.alias);
      } else cy.intercept('GET', request.path, request.data);
    });
    companyJourneyRequests.POST.forEach((request) => {
      if (request.alias) {
        cy.intercept('POST', request.path, request.data).as(request.alias);
      } else cy.intercept('POST', request.path, request.data);
    });

    // Visit the page /entreprises
    cy.visit('/entreprises/recruter-inclusif');
  });

  /**
   * Je souhaite recruter
   */
  describe('Je souhaite recruter un employé', () => {
    // J'accède au formulaire de contact dans la modale
    it("J'affiche le formulaire de contact", () => {
      cy.get('[data-testid="button-contact-company-header"]')
        .should('be.visible')
        .first()
        .click();

      cy.get('.ReactModalPortal div').first().should('be.visible');
    });

    it('Je remplis puis je valide le formulaire de contact', () => {
      // First open the contact form
      cy.get('[data-testid="button-contact-company-header"]').first().click();

      // Fill the form
      cy.get('#form-company-contact-firstName')
        .should('be.visible')
        .type('John');

      cy.get('#form-company-contact-lastName').should('be.visible').type('Doe');

      cy.get('#form-company-contact-approach-container button')
        .should('be.visible')
        .click();
      cy.get('#form-company-contact-approach-container')
        .contains('Recruter inclusif')
        .click();

      cy.get('#form-company-contact-email')
        .should('be.visible')
        .type('johndoe@gmail.com');

      cy.get('#form-company-contact-phone')
        .should('be.visible')
        .type('0698754321');

      cy.get('#form-company-contact-company')
        .should('be.visible')
        .type('Entourage');

      cy.get('#form-company-contact-position')
        .should('be.visible')
        .type('Développeur');

      cy.get('#form-company-contact-zone-container button')
        .should('be.visible')
        .click();
      cy.get('#form-company-contact-zone-container').contains('Paris').click();

      cy.get('#form-company-contact-heardAbout-container button')
        .should('be.visible')
        .click();
      cy.get('#form-company-contact-heardAbout-container')
        .contains('Autre')
        .click();

      cy.get('#form-company-contact-message')
        .should('be.visible')
        .type('Bonjour, je souhaite recruter.');

      // Send the form
      cy.get('button').contains('Envoyer').should('be.visible').click();

      // Wait for the POST request to finish
      cy.wait('@postContactCompany');

      // The modal should be closed
      cy.get('.ReactModalPortal div').should('not.exist');
    });
  });
});
