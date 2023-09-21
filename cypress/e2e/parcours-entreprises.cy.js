/* eslint-disable no-undef */

describe('Parcours Entreprises', () => {
  beforeEach(() => {
    cy.intercept('POST', '/contact/company', {
      statusCode: 201,
    }).as('postContactCompany');

    cy.intercept('GET', '/cv/cards/random*', {
      fixture: 'cv-cards-random-res',
    });

    cy.intercept('GET', '/cv/shares', { total: 184222 });
  });

  it('Ouvrir la popup du formulaire', () => {
    describe('Bouton header', () => {
      cy.visit('/entreprises', {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('tax-modal-closed', true);
        },
      });
      cy.get('[data-testid="button-contact-company-header"]')
        .should('be.visible')
        .first()
        .scrollIntoView()
        .click();

      cy.get('.ReactModalPortal div').first().should('be.visible');
    });

    describe('Bouton première section', () => {
      cy.visit('/entreprises', {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('tax-modal-closed', true);
        },
      });
      cy.get('[data-testid="button-contact-company-first-section"]')
        .should('be.visible')
        .first()
        .scrollIntoView()
        .click();

      cy.get('.ReactModalPortal div').first().should('be.visible');
    });

    describe('Bouton dernière section', () => {
      cy.visit('/entreprises', {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('tax-modal-closed', true);
        },
      });
      cy.get('[data-testid="button-contact-company-last-section"]')
        .should('be.visible')
        .first()
        .scrollIntoView()
        .click();

      cy.get('.ReactModalPortal div').first().should('be.visible');
    });
  });

  it('Remplir le formulaire, envoyer et fermer', () => {
    cy.get('.ReactModalPortal div').first().should('be.visible');

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

    cy.get('button').contains('Envoyer').should('be.visible').click();

    cy.wait('@postContactCompany');

    cy.get('.ReactModalPortal div').should('not.exist');
  });
});
