import { onboardingJourneyRequests } from '../../intercept/journey/onboarding.req';
import bootstrap from '../bootstrap';

describe('Onboarding', () => {
  /**
   * Bootstrap
   */
  bootstrap();

  /**
   * Interceptions
   */
  beforeEach(() => {
    /**
     * Remove modals
     */
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', '1234');
    window.localStorage.setItem('release-version', 'v100');

    /**
     * Configuration des interceptions spécifiques - À GARDER EN PREMIER
     * Les interceptions sont traitées dans l'ordre où elles sont définies
     * (principe "premier arrivé, premier servi")
     */
    onboardingJourneyRequests.GET.forEach((request) => {
      if (request.alias) {
        cy.intercept('GET', request.path, request.data).as(request.alias);
      } else cy.intercept('GET', request.path, request.data);
    });

    /**
     * Liste des URLs spécifiques à intercepter
     * Ajoutez vos URLs à cette liste selon vos besoins
     */
    const urlsToIntercept = [
      'user/profile/recommendations/**',
      '/user/profile/completion',
      '/messaging/conversations',
      '/messaging/conversations/**',
      // Ajoutez d'autres URLs selon vos besoins
    ];

    /**
     * Interception des requêtes pour les URLs spécifiques
     * Chaque URL de la liste sera interceptée pour les méthodes HTTP spécifiées
     */
    const interceptSpecificUrls = () => {
      urlsToIntercept.forEach((url) => {
        ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].forEach((method) => {
          cy.intercept(
            {
              method,
              url,
            },
            {
              statusCode: 200,
              body: [],
            }
          ).as(
            `${method.toLowerCase()}-${url
              .replace(/\//g, '-')
              .replace(/\*/g, 'all')}`
          );
        });
      });
    };

    // Exécutez cette fonction pour intercepter les URLs spécifiées
    interceptSpecificUrls();
  });

  describe("Etant donné que je n'ai complété mon onboarding", () => {
    describe('Et que je suis un candidat', () => {
      beforeEach(() => {
        cy.intercept('GET', '/auth/current', {
          fixture: 'auth-current-candidat-onboarding0-res',
        });
        cy.visit(`/backoffice/dashboard`);
      });

      it('should display the onboarding modal', () => {
        // The onboarding should be displayed
        cy.get('#form-onboarding-ethics-charter').should('be.visible');
      });

      it('should complete the onboarding', () => {
        // need of fixture content to fill the forms
        cy.fixture('auth-current-candidat-onboarding3-res').then((user) => {
          /**
           * Step 1: Ethics charter
           */
          // The onboarding should be displayed
          cy.get('#form-onboarding-ethics-charter').should('be.visible');

          // Accept the ethics charter
          cy.get(
            'label[for="form-onboarding-ethics-charter-hasAcceptedEthicsCharter"]'
          ).click();

          // intercept the PUT request to update the user profile
          cy.intercept('PUT', `/user/profile/${user.id}`, {
            fixture: 'auth-current-candidat-onboarding2-res',
          });

          // intercept the PUT request to update the user profile
          cy.intercept('POST', `/readDocuments/read/${user.id}`, {
            fixture: 'user-read-document-ethics-charter',
          });

          // Click on the button to confirm the form
          cy.get(
            '[data-testid="form-confirm-form-onboarding-ethics-charter"]'
          ).click();

          /**
           * Step 2: User social situation
           */
          cy.intercept('PUT', `/users/social-situations/${user.id}`, {
            statusCode: 200,
          });

          cy.get(
            '[data-testid="form-confirm-form-onboarding-candidate-social-situation"]'
          ).click();

          /**
           * Step 3: Profile (with introduction)
           */
          cy.get('[data-testid="form-onboarding-profile-introduction"]').type(
            user.userProfile.introduction
          );

          // intercept requests
          cy.intercept('PUT', `/user/profile/${user.id}`, {
            fixture: 'auth-current-candidat-onboarding3-res',
          });

          // confirm step
          cy.get(
            '[data-testid="form-confirm-form-onboarding-profile"]'
          ).click();

          // intercept requests
          cy.intercept('PUT', `/user/profile/${user.id}`, {
            fixture: 'auth-current-candidat-onboarding3-res',
          });
          cy.intercept('GET', '/auth/current', {
            fixture: 'auth-current-candidat-onboarding3-res',
          });

          /**
           * Step 4: Job (linkedin and external cv)
           */
          cy.get(
            '[data-testid="form-onboarding-candidate-job-linkedinUrl"]'
          ).type(user.userProfile.linkedinUrl);
          // confirm step
          cy.get(
            '[data-testid="form-confirm-form-onboarding-candidate-job"]'
          ).click();
        });
      });
    });
  });

  describe('Etant donné que j’ai complété mon onboarding', () => {
    beforeEach(() => {
      cy.intercept('GET', '/auth/current', {
        fixture: 'auth-current-candidat-onboarding3-res',
      });
      cy.visit(`/backoffice/dashboard`);
    });

    it('should not display the onboarding modal', () => {
      // The onboarding should not be displayed
      cy.get('#form-onboarding-ethics-charter').should('not.exist');
    });
  });
});
