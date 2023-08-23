/* eslint-disable no-undef */
// unstable test, need to identify the issue

describe('Navigation', () => {
  it('opens', () => {
    cy.visit('/');
    cy.wait(1000);

    // cy.visit(Cypress.env('base_url'))
    cy.get('header').within(() => {
      cy.get('a').contains('Je cherche un emploi').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'travailler');
    });

    cy.get('header').within(() => {
      cy.get('a').contains('Je recrute').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'entreprises');
    });

    cy.get('header').within(() => {
      cy.get('a').contains('Je veux aider').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'aider');
    });

    cy.get('header').within(() => {
      cy.get('a').contains("J'oriente un candidat").click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'orienter');
    });

    cy.get('header').within(() => {
      cy.get('button').contains('Découvrir les CV').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'candidats');
    });
  });
});
