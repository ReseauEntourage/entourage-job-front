import { refererJourneyRequests } from 'cypress/e2e/intercept/journey/referer.req';
import bootstrap from '../bootstrap';

describe('En tant que - Prescripteur', () => {
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
     * Remove modals
     */
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', '1234');
    window.localStorage.setItem('release-version', 'v100');

    /**
     * Intercept requests
     */
    refererJourneyRequests.GET.forEach((request) => {
      if (request.alias) {
        cy.intercept('GET', request.path, request.data).as(request.alias);
      } else cy.intercept('GET', request.path, request.data);
    });

    cy.intercept('GET', '/auth/current', {
      fixture: 'auth-current-referer-res',
    });
  });

  describe("Je souhaite pouvoir naviguer dans l'application", () => {
    beforeEach(() => {
      cy.visit(`/backoffice/dashboard`);
    });

    describe('Je peux accéder à mon tableau de bord personnel', () => {
      it('should display "Tableau de bord" inside the navigation', () => {
        // Check that a link with class ".menu-link" contains the text "Tableau de bord"
        cy.get('.menu-link').contains('Tableau de bord');
      });
      it('should be able to navigate to /backoffice/dashboard', () => {
        // Click on the link with the text "Tableau de bord"
        cy.get('.menu-link').contains('Tableau de bord').click();
        // Check that the URL is now /backoffice/dashboard
        cy.url().should('include', '/backoffice/dashboard');
        // Check that the page contains the text "Bienvenue sur votre tableau de bord"
        cy.contains('Bienvenue sur votre tableau de bord');
      });
    });
    describe("Je peux accéder au réseau d'entraide", () => {
      it('should display "Réseau d\'entraide" inside the navigation', () => {
        // Check that a link with class ".menu-link" contains the text "Réseau d'entraide"
        cy.get('.menu-link').contains("Réseau d'entraide");
      });
      it('should be able to navigate to /backoffice/annuaire', () => {
        // Click on the link with the text "Réseau d'entraide"
        cy.get('.menu-link').contains("Réseau d'entraide").click();
        // Check that the URL is now /backoffice/annuaire
        cy.url().should('include', '/backoffice/annuaire');
        // Check that the page contains the text "Annuaire"
        cy.contains('Bienvenue sur votre réseau');
      });
    });
    describe('Je peux accéder à la messagerie', () => {
      it('should display messaging icon inside the navigation', () => {
        // Check that a link (a) with href to /backoffice/messaging exists and got an svg inside
        cy.get('a[href="/backoffice/messaging"] svg');
      });
      it('should be able to navigate to /backoffice/messaging', () => {
        // Click on the link with the href to /backoffice/messaging
        cy.get('a[href="/backoffice/messaging"]').click();
        // Check that the URL is now /backoffice/messaging
        cy.url().should('include', '/backoffice/messaging');
      });
    });
  });

  describe('Je souhaite un dashboard pour suivre mes orientations', () => {
    beforeEach(() => {
      cy.visit(`/backoffice/dashboard`);
    });
    describe('Je suis invité à orienter un candidat', () => {
      it('should display a card with the title "Pré-inscrivez vos candidats"', () => {
        // Check contains a button with the text "Orienter un candidat"
        cy.get('button[data-testid="dashboard-invite-to-refer-btn"]').should(
          'be.visible'
        );
      });

      it('should be able to navigate to /backoffice/referer/orienter/step-1 when clicking on the button', () => {
        // Click on the button with the text "Pré-inscrire un candidat"
        cy.get('button[data-testid="dashboard-invite-to-refer-btn"]').click();
        // Check that the URL is now /backoffice/referer/orienter/step-1
        cy.url().should('include', '/backoffice/referer/orienter/step-1');
      });
    });

    describe('Je peux suivre mes orientations déjà effectuées', () => {
      it('should display a list of profile card with all the orientations', () => {
        // Intercept the request to get the orientations
        cy.wait('@candidates');

        // Check that the page contains all the orientations foreach orientation
        cy.get('.profile-card').should('have.length', 10);
      });
    });
    describe('Je peux voir facilement les informations de mon compte', () => {
      it('should display the user profile in a dedicated card', () => {
        // Check that the page contains the user profile card
        cy.get("[data-testid='dashboard-profile-card']").contains('Mike F.');
      });
    });
  });

  describe('Je souhaite orienter un candidat', () => {
    beforeEach(() => {
      cy.visit(`/backoffice/referer/orienter/step-1`);
      cy.intercept('POST', '/user/refering', {
        statusCode: 201,
      }).as('postRefering');
    });
    describe('Je peux orienter un candidat', () => {
      it('should complete refering of his candidate - program is automaticaly computed', () => {
        // Check that the URL is /backoffice/referer/orienter/step-1
        cy.url().should('include', 'step-1');

        // Fill the form
        cy.get('[data-testid="form-refering-account-firstName"]').type('John');
        cy.get('[data-testid="form-refering-account-lastName"]').type('Doe');
        cy.get('[data-testid="form-refering-account-gender"]')
          .click()
          .get('[data-testid="select-option-0"]')
          .click();
        cy.get('#form-refering-account-phone').type('0698754321');
        cy.get('#form-refering-account-email').type('johndoe@gmail.com');

        cy.get(
          'label[for="form-refering-account-confirmReferingRules"]'
        ).click();
        cy.contains('Suivant').click();

        // Check that the URL is now /backoffice/referer/orienter/step-2
        cy.url().should('include', 'step-2');

        // Select the help needs
        cy.wait('@nudges');
        // Fill the candidate expectations
        cy.get('[data-testid="form-refering-candidate-expectations-nudgeIds"]')
          .should('be.visible')
          .first() // Select the first nudge
          .click();
        cy.contains('Suivant').click();

        // Check that the URL is now /backoffice/referer/orienter/step-3
        cy.url().should('include', 'step-3');

        // Fill the form
        cy.get('[data-testid="form-refering-candidate-info-birthDate"]').type(
          '1990-01-01'
        );
        cy.get('#form-refering-candidate-info-department')
          .click()
          .find('.Select__option')
          .contains('Paris')
          .click();
        cy.get('[data-testid="working-right-yes"]').click();
        cy.get('[data-testid="material-insecurity-yes"]').click();
        cy.get('[data-testid="network-insecurity-no"]').click();
        cy.contains('Suivant').click();

        // Check that the URL is now /backoffice/referer/orienter/step-4
        cy.url().should('include', 'step-4');

        // Fill the professional information
        cy.get(
          '#form-refering-candidate-professional-information-businessSectorId0'
        ).click();
        cy.wait('@businessSectors');
        cy.get(
          '#form-refering-candidate-professional-information-businessSectorId0'
        )
          .find('.Select__option')
          .contains('Sector 1')
          .click();
        cy.contains('Suivant').click();
      });
    });
  });
});
