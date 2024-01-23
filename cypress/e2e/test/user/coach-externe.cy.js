/* eslint-disable no-undef */
import bootstrap from '../bootstrap.js';
import { coachExtRequests } from '../../intercept/user/coach-externe.req.js';

/**
 * En tant que Coach externe
 */
describe('En tant que - Coach Externe', () => {
  /**
   * Nous générons toutes les fixtures
   */
  bootstrap();

  /**
   * Initialisation d'une base commune à tout les tests
   */
  beforeEach(() => {
    /**
     * Intercept GET requests
     */
    coachExtRequests.GET.map((request) => {
      if (request.alias)
        cy.intercept('GET', request.path, request.data).as(request.alias);
      else cy.intercept('GET', request.path, request.data);
    });

    // Nous avons besoin de l'objet user de la fixture api/coach-login.json
    // pour pouvoir intercepté les 2 requêtes suivantes [ vérifier dans 'network' (; ]
    cy.fixture('api/coach-login').then((user) => {
      // Pour /backoffice/candidat/list
      cy.intercept('GET', `/cv/${user.coaches[0].candidat.id}`, {});
      // Pour /backoffice/parametres
      cy.intercept('GET', `/user/${user.id}`, {
        fixture: 'api/coach-login',
      });
    });
  });

  /**
   * Je parcours les candidats
   */
  it("J'affiche les candidats", () => {
    // Accèdons à l'URL des membres
    cy.visit('/backoffice/candidat/list', {
      // J'ajoute un fake token dans mon localStorage pour simuler l'authentification
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('access-token', '0x1x2x3x4');
        window.localStorage.setItem('release-version', 'v100');
      },
    });

    // Possible d'augmenter ici la taille de la liste tester en augmentant
    // également le nombre de candidat - coaches: [...] - au sein de la fixture api/coach-login.json
    cy.get('[data-testid="member-list"] > tr').its('length').should('eq', 1);
  });

  /**
   * Je parcours les paramètres
   */
  it("J'affiche les paramètres du compte", () => {
    // Accèdons à l'URL des paramètres du compte
    cy.visit('/backoffice/parametres', {
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('access-token', '0x1x2x3x4');
        window.localStorage.setItem('release-version', 'v100');
      },
    });

    cy.get('[data-testid="linkeduser-email-span"]').should('not.exist');
  });
});
