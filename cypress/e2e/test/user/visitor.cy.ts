import bootstrap from '../bootstrap';
import { visitorRequests } from '../../intercept/user/visitor.req';

/**
 * Je parcours la navigation
 */
describe('En tant que - Visiteur', () => {
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
     * Intercept GET request
     */
    visitorRequests.GET.map((request) => {
      if (request.alias)
        cy.intercept('GET', request.path, request.data).as(request.alias);
      else cy.intercept('GET', request.path, request.data);
    });

    // Visite la page d'accueil
    cy.visit('/');
    cy.wait(1000);
  });

  /**
   * Je parcours la page /travailler
   */
  it("J'accède à la page - /travailler", () => {
    cy.get('header').within(() => {
      cy.get('a').contains('Devenir candidat(e)').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'travailler');
    });
  });

  /**
   * Je parcours la page /entreprise/s-engager
   */
  it("J'accède à la page - /entreprises", () => {
    cy.get('header').within(() => {
      cy.get('div').contains('Engager mon entreprise').click({ force: true });
      cy.wait(1000);
      cy.get('a').contains('Engager mes collaborateurs').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 's-engager');
    });
  });

  /**
   * Je parcours la page /entreprise/recruter-inclusif
   */
  it("J'accède à la page - /entreprises", () => {
    cy.get('header').within(() => {
      cy.get('div').contains('Engager mon entreprise').click({ force: true });
      cy.wait(1000);
      cy.get('a').contains('Recruter inclusif').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'recruter-inclusif');
    });
  });

  /**
   * Je parcours la page /aider
   */
  it("J'accède à la page - /aider", () => {
    cy.get('header').within(() => {
      cy.get('a').contains('Devenir coach').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'aider');
    });
  });
  /**
   * Je vais sur la page login
   */
  it("J'accède à la page - /login", () => {
    cy.get('header').within(() => {
      cy.get('button').contains('Connexion').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'login');
    });
  });
  /**
   * Je vais sur la page inscription
   */
  it("J'accède à la page - /inscription", () => {
    cy.get('header').within(() => {
      cy.get('button').contains('Inscription').click({ force: true });
      cy.wait(1000);
      cy.url().should('include', 'inscription');
    });
  });
});
