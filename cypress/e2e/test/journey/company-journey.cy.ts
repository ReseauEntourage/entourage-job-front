/* eslint-disable no-undef */
import bootstrap from '../bootstrap';
import { companyJourneyRequests } from '../../intercept/journey/company.req';

describe('En tant que - Employeur/Entreprise', () => {
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
     * Intercept GET requests
     */
    companyJourneyRequests.GET.map((request) => {
      if (request.alias)
        cy.intercept('GET', request.path, request.data).as(request.alias);
      else cy.intercept('GET', request.path, request.data);
    });
    /**
     * Intercept POST requests
     */
    companyJourneyRequests.POST.map((request) => {
      if (request.alias)
        cy.intercept('POST', request.path, request.data).as(request.alias);
      else cy.intercept('POST', request.path, request.data);
    });
    /**
     * Intercept PUT requests -- no PUT request for now
     */
    // companyJourneyRequests.PUT.map((request) => {
    //   if (request.alias)
    //     cy.intercept('PUT', request.path, request.data).as(request.alias);
    //   else cy.intercept('PUT', request.path, request.data);
    // });
  });

  /**
   * Je souhaite recruter
   */
  describe('Je souhaite recruter un employé', () => {
    // J'accède a la page /entreprise
    it("J'accède à la page /entreprise", () => {
      cy.visit('/entreprises', {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('tax-modal-closed', 'true');
        },
      });
      // j'attend 0.5sec
      cy.wait(500);
    });

    // Formulaire
    it("J'affiche le formulaire de contact", () => {
      cy.get('[data-testid="button-contact-company-header"]')
        .should('be.visible')
        .first()
        .click();

      cy.get('.ReactModalPortal div').first().should('be.visible');
    });

    // Remplissage du formulaire
    it('Je remplis puis je valide le formulaire de contact', () => {
      cy.get('#form-company-contact-firstName')
        .should('be.visible')
        .type('John');

      cy.get('#form-company-contact-lastName').should('be.visible').type('Doe');

      cy.get('#form-company-contact-approach-container')
        .should('be.visible')
        .click()
        .find('.option')
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

      cy.get('#form-company-contact-zone-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Paris')
        .click();

      cy.get('#form-company-contact-heardAbout-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Autre')
        .click();

      cy.get('#form-company-contact-message')
        .should('be.visible')
        .type('Bonjour, je souhaite recruter.');

      cy.get('button').contains('Envoyer').should('be.visible').click();

      cy.wait('@postContactCompany');

      cy.get('.ReactModalPortal div').should('not.exist');
    });
  });

  /**
   * Je souhaite partager une offre (publique et privée)
   */
  describe('Je souhaite partager des offres publique / privée', () => {
    // J'accède a la page /entreprise
    it("J'accède à la page /entreprise", () => {
      cy.visit('/entreprises', {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('tax-modal-closed', 'true');
        },
      });
      // j'attend 0.5sec
      cy.wait(500);
    });

    // Formulaire
    it("J'affiche le formulaire d'offre publique", () => {
      cy.get('[data-testid="button-offer-company-header"]')
        .should('be.visible')
        .first()
        .click();

      cy.get('.ReactModalPortal div').first().should('be.visible');
    });

    // Remplissage formulaire
    it("Je remplis puis je valide le formulaire de proposition d'une offre publique", () => {
      cy.get('#form-add-public-offer-title').type('Form test');

      cy.get('#form-add-public-offer-company').type('Random company');

      cy.get('#form-add-public-offer-companyDescription').type(
        'Random presentation'
      );

      cy.get('#form-add-public-offer-locations-0-department')
        .should('be.visible')
        .type('Paris');

      cy.get('#form-add-public-offer-locations-0-department')
        .find('.Select__menu')
        .should('be.visible')
        .find('.Select__option')
        .contains('Paris (75)')
        .click();

      cy.get('#form-add-public-offer-locations-0-address').type('Rue de Paris');

      cy.get('button').contains('Ajouter une adresse').click();

      cy.get('#form-add-public-offer-locations-1-department')
        .should('be.visible')
        .type('Rhône');

      cy.get('#form-add-public-offer-locations-1-department')
        .find('.Select__menu')
        .should('be.visible')
        .find('.Select__option')
        .contains('Rhône (69)')
        .click();

      cy.get('#form-add-public-offer-locations-1-address').type('Rue du Rhône');

      cy.get('#form-add-public-offer-recruiterFirstName').type('John');

      cy.get('#form-add-public-offer-recruiterName').type('Doe');

      cy.get('#form-add-public-offer-recruiterPosition').type(
        'Random position'
      );

      cy.get('#form-add-public-offer-recruiterMail').type('johndoe@gmail.com');

      cy.get('#form-add-public-offer-recruiterPhone').type('0698754321');

      cy.get('#form-add-public-offer-description').type('Random description');

      cy.get('#form-add-public-offer-contract-container')
        .click()
        .find('.option')
        .contains('CDI')
        .click();

      cy.get('button').contains('Envoyer').click();

      cy.wait('@postOpportunity');

      cy.get('.ReactModalPortal div').should('not.exist');
    });
  });
});
