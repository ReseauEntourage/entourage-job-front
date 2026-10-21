import bootstrap from '../bootstrap';

describe('En tant que - Visiteur, je ne peux pas accéder aux paramètres', () => {
  bootstrap();

  it('Redirige un visiteur non connecté vers la page de connexion', () => {
    cy.intercept('GET', '/current', { statusCode: 401, body: {} }).as(
      'getCurrentUnauthorized'
    );

    cy.visit('/backoffice/parametres');

    cy.url().should('include', '/login');
  });
});
