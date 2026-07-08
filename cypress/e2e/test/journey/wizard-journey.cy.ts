import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import { wizardJourneyRequests } from '../../intercept/journey/wizard.req';
import bootstrap from '../bootstrap';

describe('Wizard', () => {
  /**
   * Generate fixtures
   */
  bootstrap();

  const interceptWizardGetRequests = () => {
    wizardJourneyRequests.GET.forEach((request) => {
      if (request.alias) {
        cy.intercept('GET', request.path, request.data).as(request.alias);
      } else {
        cy.intercept('GET', request.path, request.data);
      }
    });
  };

  describe("Etant donné que je suis un visiteur sur le wizard d'inscription", () => {
    beforeEach(() => {
      /**
       * Remove modals
       */
      window.localStorage.setItem('entourage-pro-modal-closed', 'true');

      interceptWizardGetRequests();
      interceptCurrentUserSubResources();

      // Visiteur : pas d'utilisateur courant
      cy.intercept('GET', '/current', { statusCode: 401 }).as(
        'currentIdentityUnauthorized'
      );

      cy.intercept('POST', '/user/registration', {
        statusCode: 201,
      }).as('postRegistration');

      cy.intercept('POST', '/auth/verify-otp', {
        statusCode: 200,
        body: { token: 'fake-jwt-token' },
      }).as('verifyOtp');
    });

    describe('Quand je visite la page /wizard', () => {
      beforeEach(() => {
        cy.visit('/wizard');
      });

      it('should display the role selection with a disabled start button', () => {
        cy.contains('Qu’est-ce qui vous amène ?');
        cy.contains('button', "Commencer l'inscription").should('be.disabled');
      });

      it('should start the candidate flow after selecting the role "Candidat"', () => {
        cy.get('[data-testid="wizard-flow-selection-candidate"]')
          .should('be.visible')
          .click();
        cy.contains('button', "Commencer l'inscription")
          .should('not.be.disabled')
          .click();
        cy.url().should('include', '/wizard/run');
      });

      describe('Etant donné que je souhaite devenir un candidat', () => {
        beforeEach(() => {
          cy.get('[data-testid="wizard-flow-selection-candidate"]')
            .should('be.visible')
            .click();
          cy.contains('button', "Commencer l'inscription").click();
          cy.url().should('include', '/wizard/run');
        });

        it('should complete the whole candidate registration up to the onboarding after OTP verification', () => {
          // Étape 1 — Coups de pouce (nudges)
          cy.contains('sur quoi aimeriez-vous un coup de pouce');
          cy.wait('@nudges');
          cy.get('[data-testid^="nudgeIds-"]').first().click();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 2 — Secteurs et métiers recherchés
          cy.contains('Quel métier(s) et secteur(s) visez-vous ?');
          cy.get('#form-onboarding-profile-completion-businessSectorId0')
            .should('be.visible')
            .click();
          cy.get('#form-onboarding-profile-completion-businessSectorId0')
            .find('.Select__option')
            .first()
            .click();
          cy.get('[data-testid="wizard-next-step-btn"]')
            .should('not.be.disabled')
            .click();

          // Étape 3 — Aperçu du réseau (profils compatibles)
          cy.wait('@compatibleProfiles');
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 4 — Informations candidat (naissance + département)
          cy.get(
            '[data-testid="form-registration-candidate-info-birthDate"]'
          ).type('1990-01-01');
          cy.get('#form-registration-candidate-info-department')
            .click()
            .find('.Select__option')
            .contains('Paris')
            .click();
          cy.get('[data-testid="working-right-yes"]').click();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 5 — Éligibilité (situation économique et sociale)
          cy.get('[data-testid="material-insecurity-yes"]').click();
          cy.get('[data-testid="network-insecurity-no"]').click();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 6 — Création du compte
          cy.get('[data-testid="form-registration-account-firstName"]').type(
            'John'
          );
          cy.get('[data-testid="form-registration-account-lastName"]').type(
            'Doe'
          );
          cy.get('[data-testid="form-registration-account-gender"]')
            .click()
            .get('[data-testid="select-option-0"]')
            .click();
          cy.get('#form-registration-account-email').type('johndoe@gmail.com');
          cy.get('#form-registration-account-phone').type('0698754321');
          cy.get('[data-testid="form-registration-account-password"]').type(
            'Azerty123!'
          );
          cy.get(
            '[data-testid="form-registration-account-confirmPassword"]'
          ).type('Azerty123!');
          cy.get('input[id="form-registration-account-acceptCGU"]').click({
            force: true,
          });
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Le compte est créé sans préférences obligatoires manquantes
          cy.wait('@postRegistration')
            .its('request.body')
            .should((body) => {
              expect(body.email).to.equal('johndoe@gmail.com');
              expect(body.role).to.equal('Candidat');
            });

          // Étape 7 — Confirmation email (OTP)
          cy.get('input[inputmode="numeric"]').should('have.length', 6);

          // Une fois l'OTP validé, l'utilisateur courant devient disponible
          cy.intercept('GET', '/current', {
            fixture: 'auth-current-candidate-onboarding-not-started-res',
          }).as('currentIdentity');

          cy.get('input[inputmode="numeric"]').first().type('123456');
          cy.get('[data-testid="wizard-next-step-btn"]').click();
          cy.wait('@verifyOtp');

          // Phase onboarding — le candidat démarre sur la situation sociale
          cy.contains('Quelques infos pour vous proposer le bon soutien');
        });
      });
    });
  });

  describe('Etant donné que je suis un candidat authentifié en cours d’onboarding', () => {
    beforeEach(() => {
      window.localStorage.setItem('entourage-pro-modal-closed', 'true');
      window.localStorage.setItem('access-token', '1234');

      interceptWizardGetRequests();
      interceptCurrentUserSubResources();
    });

    it('should be redirected from the backoffice to the wizard and resume on the social situation step', () => {
      cy.intercept('GET', '/current', {
        fixture: 'auth-current-candidate-onboarding-not-started-res',
      }).as('currentIdentity');

      cy.visit('/backoffice/dashboard');

      // Le guard d'onboarding redirige vers le wizard
      cy.url().should('include', '/wizard/run');
      cy.contains('Quelques infos pour vous proposer le bon soutien');
    });

    it('should resume on the photo step when the social situation is already completed', () => {
      cy.fixture('auth-current-candidate-onboarding-not-started-res').then(
        (user) => {
          cy.intercept('GET', '/current', {
            statusCode: 200,
            body: {
              ...user,
              onboardingStatus: 'in_progress',
              userSocialSituation: { hasCompletedSurvey: true },
            },
          }).as('currentIdentity');
        }
      );

      cy.visit('/wizard/run');

      cy.contains('Commençons par une photo de vous');
    });

    it('should be redirected to the dashboard when the onboarding is already completed', () => {
      cy.intercept('GET', '/current', {
        fixture: 'auth-current-candidate-onboarding-completed-res',
      }).as('currentIdentity');

      cy.visit('/wizard/run');

      cy.url().should('include', '/backoffice/dashboard');
    });
  });
});
