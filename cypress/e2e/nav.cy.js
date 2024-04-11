/* eslint-disable no-undef */
// unstable test, need to identify the issue

describe('Navigation', () => {
  it('opens', () => {
    cy.visit('/');
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    cy.wait(1000);

    // cy.visit(Cypress.env('base_url'))
    cy.get('header').within(() => {
      cy.get('a').contains('Devenir candidat(e)').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'travailler');
    });

    cy.get('header').within(() => {
      cy.get('a').contains('Engager son entreprise').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'entreprises');
    });

    cy.get('header').within(() => {
      cy.get('a').contains('Devenir coach').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'aider');
    });

    cy.get('header').within(() => {
      cy.get('a').contains('Découvrir les candidat(e)s').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'candidats');
    });

    cy.get('header').within(() => {
      cy.get('button').contains('Connexion').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'login');
    });

    cy.get('header').within(() => {
      cy.get('button').contains('Inscription').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'inscription');
    });
  });
});
