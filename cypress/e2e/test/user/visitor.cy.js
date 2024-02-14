/* eslint-disable no-undef */
import bootstrap from '../bootstrap.js';
import { visitorRequests } from '../../intercept/user/visitor.req.js';

/**
 * Je parcours la navigation
 */
describe('En tant que - Visiteur', () => {
  /**
   * Nous générons toutes les fixtures
   */
  bootstrap();

  /**
   * Initialisation d'une base commune à tout les tests
   */
  beforeEach(() => {
    /**
     * Intercept GET request
     */
    visitorRequests.GET.map((request) => {
      if (request.alias)
        cy.intercept('GET', request.path, request.data).as(request.alias);
      else cy.intercept('GET', request.path, request.data);
    });

    // Visite la page d'accueil
    cy.visit('/');
  });

  /**
   * Je parcours la page /travailler
   */
  it("J'accède à la page - /travailler", () => {
    cy.wait('@cvCardsRandom').then(() => {
      cy.get('#header').within(() => {
        cy.get('nav').find('li a').contains('Je cherche un emploi').click();
      });
      cy.url().should('include', 'travailler');
    });
  });

  /**
   * Je parcours la page /entreprise
   */
  it("J'accède à la page - /entreprises", () => {
    cy.wait('@cvCardsRandom').then(() => {
      cy.get('#header').within(() => {
        cy.get('nav').find('li a').contains('Je recrute').click();
      });
      cy.url().should('include', 'entreprises');
    });
  });

  /**
   * Je parcours la page /aider
   */
  it("J'accède à la page - /aider", () => {
    cy.wait('@cvCardsRandom').then(() => {
      cy.get('#header').within(() => {
        cy.get('nav').find('li a').contains('Je veux aider').click();
      });
      cy.url().should('include', 'aider');
    });
  });

  /**
   * Je parcours la page /orienter
   */
  it("J'accède à la page - /orienter", () => {
    cy.wait('@cvCardsRandom').then(() => {
      cy.get('#header').within(() => {
        cy.get('nav').find('li a').contains("J'oriente un candidat").click();
      });
      cy.url().should('include', 'orienter');
    });
  });

  /**
   * Je parcours les candidats
   */
  it("J'accède à la page - /candidats", () => {
    cy.wait('@cvCardsRandom').then(() => {
      cy.get('#header').within(() => {
        cy.get('nav').find('li button').contains('Découvrir les CV').click();
      });
      cy.url().should('include', 'candidats');
    });
  });
});
