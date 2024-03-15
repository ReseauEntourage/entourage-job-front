/* eslint-disable no-undef */
// unstable test, need to identify the issue

describe('Navigation', () => {
  it('opens', () => {
    
    cy.visit('/');
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    cy.wait(1000);

    // cy.visit(Cypress.env('base_url'))
    cy.get('header').within(() => {
      cy.get('a').contains('Devenir candidat').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'travailler');
    });

    cy.get('header').within(() => {
      cy.get('a').contains('Sensibiliser son entreprise').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'entreprises');
    });

    cy.get('header').within(() => {
      cy.get('a').contains('Devenir coach').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'aider');
    });

    cy.get('header').within(() => {
      cy.get('a').contains("Nous contacter").click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'contact');
    });

    cy.get('header').within(() => {
      cy.get('a').contains('Découvrir les candidats').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'candidats');
    });

    cy.get('header').within(() => {
      cy.get('button').contains('Inscription / Connexion').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'login');
    });
  });
});
