
describe('Parcours Entreprises', () => {
  beforeEach(() => {
    cy.intercept('POST', '/contact/company', {
      statusCode: 201,
    }).as('postContactCompany');

    cy.intercept('GET', '/cv/cards/random*', {
      fixture: 'cv-cards-random-res',
    });

    cy.intercept('GET', '/cv/shares', { total: 184222 });

    cy.intercept('POST', '/opportunity', {
      fixture: 'opportunity-res',
    }).as('postOpportunity');

    cy.visit('/entreprises', {
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('tax-modal-closed', 'true');
        window.localStorage.setItem('entourage-pro-modal-closed', 'true');
      },
    });
    cy.wait(500);
  });
  describe('Formulaire de contact', () => {
    describe('Ouvrir la popup du formulaire de contact', () => {
      it('Bouton header', () => {
        cy.get('[data-testid="button-contact-company-header"]')
          .should('be.visible')
          .first()
          .scrollIntoView()
          .click();

        cy.get('.ReactModalPortal div').first().should('be.visible');
      });

      it('Bouton première section', () => {
        cy.get('[data-testid="button-company-first-section"]')
          .first()
          .scrollIntoView()
          .should('be.visible')
          .click();

        cy.get('.ReactModalPortal div').first().should('be.visible');
      });

      it('Bouton dernière section', () => {
        cy.get('[data-testid="button-contact-company-last-section"]')
          .first()
          .scrollIntoView()
          .should('be.visible')
          .click();

        cy.get('.ReactModalPortal div').first().should('be.visible');
      });
    });

    it('Remplir le formulaire, envoyer et fermer', () => {
      cy.get('[data-testid="button-contact-company-header"]')
        .should('be.visible')
        .first()
        .scrollIntoView()
        .click();

      cy.get('#form-company-contact-firstName')
        .should('be.visible')
        .scrollIntoView()
        .type('John');

      cy.get('#form-company-contact-lastName')
        .should('be.visible')
        .scrollIntoView()
        .type('Doe');

      cy.get('#form-company-contact-approach-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Recruter inclusif')
        .click();

      cy.get('#form-company-contact-email')
        .should('be.visible')
        .scrollIntoView()
        .type('johndoe@gmail.com');

      cy.get('#form-company-contact-phone')
        .should('be.visible')
        .scrollIntoView()
        .type('0698754321');

      cy.get('#form-company-contact-company')
        .should('be.visible')
        .scrollIntoView()
        .type('Entourage');

      cy.get('#form-company-contact-position')
        .should('be.visible')
        .scrollIntoView()
        .type('Développeur');

      cy.get('#form-company-contact-zone-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Paris')
        .click();

      cy.get('#form-company-contact-heardAbout-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Autre')
        .click();

      cy.get('#form-company-contact-message')
        .should('be.visible')
        .scrollIntoView()
        .type('Bonjour, je souhaite recruter.');

      cy.get('button').contains('Envoyer').should('be.visible').click();

      cy.wait('@postContactCompany');

      cy.get('.ReactModalPortal div').should('not.exist');
    });
  });

  describe("Formulaire d'offre publique", () => {
    describe("Ouvrir la popup du formulaire d'offre publique", () => {
      it('Bouton header', () => {
        cy.get('[data-testid="button-offer-company-header"]')
          .should('be.visible')
          .first()
          .scrollIntoView()
          .click();

        cy.get('.ReactModalPortal div').first().should('be.visible');
      });

      it('Bouton deuxième section', () => {
        cy.get('[data-testid="button-company-second-section"]')
          .first()
          .scrollIntoView()
          .should('be.visible')
          .click();

        cy.get('.ReactModalPortal div').first().should('be.visible');
      });
    });

    it('Remplir le formulaire, envoyer et fermer', () => {
      cy.get('[data-testid="button-offer-company-header"]')
        .should('be.visible')
        .first()
        .scrollIntoView()
        .click();

      cy.get('#form-add-public-offer-title').scrollIntoView().type('Form test');
      cy.get('#form-add-public-offer-company')
        .scrollIntoView()
        .type('Random company');
      cy.get('#form-add-public-offer-companyDescription')
        .scrollIntoView()
        .type('Random presentation');

      cy.get('#form-add-public-offer-locations-0-department')
        .should('be.visible')
        .scrollIntoView()
        .type('Paris');

      cy.get('#form-add-public-offer-locations-0-department')
        .find('.Select__menu')
        .should('be.visible')
        .scrollIntoView()
        .find('.Select__option')
        .contains('Paris (75)')
        .click();

      cy.get('#form-add-public-offer-locations-0-address')
        .scrollIntoView()
        .type('Rue de Paris');

      cy.get('button').contains('Ajouter une adresse').scrollIntoView().click();

      cy.get('#form-add-public-offer-locations-1-department')
        .should('be.visible')
        .scrollIntoView()
        .type('Rhône');

      cy.get('#form-add-public-offer-locations-1-department')
        .find('.Select__menu')
        .should('be.visible')
        .scrollIntoView()
        .find('.Select__option')
        .contains('Rhône (69)')
        .click();

      cy.get('#form-add-public-offer-locations-1-address')
        .scrollIntoView()
        .type('Rue du Rhône');

      cy.get('#form-add-public-offer-recruiterFirstName')
        .scrollIntoView()
        .type('John');
      cy.get('#form-add-public-offer-recruiterName')
        .scrollIntoView()
        .type('Doe');
      cy.get('#form-add-public-offer-recruiterPosition')
        .scrollIntoView()
        .type('Random position');
      cy.get('#form-add-public-offer-recruiterMail')
        .scrollIntoView()
        .type('johndoe@gmail.com');
      cy.get('#form-add-public-offer-recruiterPhone')
        .scrollIntoView()
        .type('0698754321');

      cy.get('#form-add-public-offer-description')
        .scrollIntoView()
        .type('Random description');

      cy.get('#form-add-public-offer-contract-container')
        .scrollIntoView()
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
