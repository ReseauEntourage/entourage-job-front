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

  const fillAccountForm = (email = 'johndoe@gmail.com') => {
    cy.get('[data-testid="form-registration-account-firstName"]').type('John');
    cy.get('[data-testid="form-registration-account-lastName"]').type('Doe');
    cy.get('[data-testid="form-registration-account-gender"]')
      .click()
      .get('[data-testid="select-option-0"]')
      .click();
    cy.get('#form-registration-account-email').type(email);
    cy.get('#form-registration-account-phone').type('0698754321');
    cy.get('[data-testid="form-registration-account-password"]').type(
      'Azerty123!'
    );
    cy.get('input[id="form-registration-account-acceptCGU"]').click({
      force: true,
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
          fillAccountForm();
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

          // La saisie du 6e chiffre déclenche la vérification automatiquement
          cy.get('input[inputmode="numeric"]').first().type('123456');
          cy.wait('@verifyOtp');

          // Phase onboarding — le candidat démarre sur la situation sociale
          cy.contains('Quelques infos pour vous proposer le bon soutien');

          // Une fois l'OTP validé, l'étape de confirmation email n'est plus
          // accessible : ni bouton "Modifier l'email", ni input de code.
          cy.contains("Modifier l'email").should('not.exist');
          cy.get('input[inputmode="numeric"]').should('not.exist');
        });

        it('should let the user edit the email from the OTP step, resubmit, and complete registration with the corrected email', () => {
          // Étape 1 — Coups de pouce (nudges)
          cy.wait('@nudges');
          cy.get('[data-testid^="nudgeIds-"]').first().click();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 2 — Secteurs et métiers recherchés
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

          // Étape 3 — Aperçu du réseau
          cy.wait('@compatibleProfiles');
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 4 — Informations candidat
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

          // Étape 5 — Éligibilité
          cy.get('[data-testid="material-insecurity-yes"]').click();
          cy.get('[data-testid="network-insecurity-no"]').click();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 6 — Création du compte avec un email erroné
          fillAccountForm('typo@gmail.com');
          cy.get('[data-testid="wizard-next-step-btn"]').click();
          cy.wait('@postRegistration');

          // Étape 7 — Confirmation email (OTP) : clic sur "Modifier l'email"
          cy.get('input[inputmode="numeric"]').should('have.length', 6);
          cy.contains('button', "Modifier l'email").click();

          // Retour sur "Mon compte" : les champs saisis sont conservés (hors
          // mot de passe), l'email erroné est éditable
          cy.get('[data-testid="form-registration-account-firstName"]').should(
            'have.value',
            'John'
          );
          cy.get('#form-registration-account-email')
            .should('have.value', 'typo@gmail.com')
            .clear()
            .type('johndoe.fixed@gmail.com');
          cy.get('[data-testid="form-registration-account-password"]').type(
            'Azerty123!'
          );
          cy.get('input[id="form-registration-account-acceptCGU"]').click({
            force: true,
          });
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Un nouveau cycle d'inscription démarre avec l'email corrigé
          cy.wait('@postRegistration')
            .its('request.body')
            .should((body) => {
              expect(body.email).to.equal('johndoe.fixed@gmail.com');
            });

          // Nouveau cycle OTP indépendant : un nouveau code peut être saisi
          cy.get('input[inputmode="numeric"]').should('have.length', 6);

          cy.intercept('GET', '/current', {
            fixture: 'auth-current-candidate-onboarding-not-started-res',
          }).as('currentIdentity');

          cy.get('input[inputmode="numeric"]').first().type('123456');
          cy.wait('@verifyOtp');

          cy.contains('Quelques infos pour vous proposer le bon soutien');
        });
      });

      describe('Etant donné que je souhaite devenir un coach', () => {
        beforeEach(() => {
          cy.get('[data-testid="wizard-flow-selection-coach"]')
            .should('be.visible')
            .click();
          cy.contains('button', "Commencer l'inscription").click();
          cy.url().should('include', '/wizard/run');
        });

        it('should complete the coach registration up to the email confirmation', () => {
          // Étape 1 — Coups de pouce proposés
          cy.contains('comment aimeriez-vous aider');
          cy.wait('@nudges');
          cy.get('[data-testid^="nudgeIds-"]').first().click();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 2 — Métier + secteurs où le coach a du réseau
          cy.get(
            '[data-testid="form-onboarding-profile-completion-currentJob"]'
          ).type('Product Manager');
          cy.get('#form-onboarding-profile-completion-businessSectorIds')
            .should('be.visible')
            .click();
          cy.get('#form-onboarding-profile-completion-businessSectorIds')
            .find('.Select__option')
            .first()
            .click();
          cy.get('[data-testid="wizard-next-step-btn"]')
            .should('not.be.disabled')
            .click();

          // Étape 3 — Aperçu du réseau
          cy.wait('@compatibleProfiles');
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 4 — Informations coach (naissance + département)
          cy.get('[data-testid="form-registration-coach-info-birthDate"]').type(
            '1985-05-05'
          );
          cy.get('#form-registration-coach-info-department')
            .click()
            .find('.Select__option')
            .contains('Paris')
            .click();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 5 — Création du compte
          fillAccountForm();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          cy.wait('@postRegistration')
            .its('request.body')
            .should((body) => {
              expect(body.role).to.equal('Coach');
              expect(body.currentJob).to.equal('Product Manager');
            });

          // Confirmation email (OTP)
          cy.get('input[inputmode="numeric"]').should('have.length', 6);
        });
      });

      describe('Etant donné que je représente une entreprise', () => {
        beforeEach(() => {
          cy.get('[data-testid="wizard-flow-selection-company"]')
            .should('be.visible')
            .click();
          cy.contains('button', "Commencer l'inscription").click();
          cy.url().should('include', '/wizard/run');
        });

        it('should complete the reduced company admin flow without matching preference steps', () => {
          // Étape 1 — Rôle dans l'entreprise
          cy.get('#form-registration-company-role-companyRole')
            .click()
            .find('.Select__option')
            .contains('Dirigeant.e')
            .click();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 2 — Sélection/création de l'entreprise
          cy.get('#form-registration-company-selection-companyName')
            .click()
            .type('Wizard Corp');
          cy.get('#form-registration-company-selection-companyName')
            .find('.Select__option')
            .contains('Wizard Corp')
            .click();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 3 — Naissance + département, directement : le parcours réduit
          // ne présente ni coups de pouce, ni secteurs, ni aperçu du réseau
          cy.get('[data-testid="form-registration-coach-info-birthDate"]').type(
            '1980-01-01'
          );
          cy.get('#form-registration-coach-info-department')
            .click()
            .find('.Select__option')
            .contains('Paris')
            .click();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Étape 4 — Création du compte
          fillAccountForm();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          cy.wait('@postRegistration')
            .its('request.body')
            .should((body) => {
              expect(body.role).to.equal('Coach');
              expect(body.companyName).to.equal('Wizard Corp');
              expect(body.companyRole).to.equal('executive');
            });

          // Confirmation email (OTP)
          cy.get('input[inputmode="numeric"]').should('have.length', 6);
        });

        it('should switch to the full coach flow when selecting the role "Autre"', () => {
          cy.get('#form-registration-company-role-companyRole')
            .click()
            .find('.Select__option')
            .contains('Autre')
            .click();
          cy.get('[data-testid="wizard-next-step-btn"]').click();

          // Bascule vers le parcours Coach complet : première étape = coups de pouce
          cy.contains('comment aimeriez-vous aider');
        });
      });

      describe('Etant donné que je représente une structure associative', () => {
        beforeEach(() => {
          cy.get('[data-testid="wizard-flow-selection-referer"]')
            .should('be.visible')
            .click();
          cy.contains('button', "Commencer l'inscription").click();
          cy.url().should('include', '/wizard/run');
        });

        it('should register in a single step and skip the onboarding entirely', () => {
          // Étape unique — compte prescripteur
          cy.get('[data-testid="form-registration-account-firstName"]').type(
            'Jane'
          );
          cy.get('[data-testid="form-registration-account-lastName"]').type(
            'Doe'
          );
          cy.get('#form-registration-account-phone').type('0698754321');
          cy.get('#form-registration-account-email').type('janedoe@asso.org');
          cy.get('#form-registration-account-department')
            .click()
            .find('.Select__option')
            .contains('Paris')
            .click();

          cy.fixture('api/generated/organizations').then((organizations) => {
            const firstOrganization = organizations[0];
            cy.get('#form-registration-account-organizationId')
              .should('be.visible')
              .type(firstOrganization.name);
            cy.get('#form-registration-account-organizationId')
              .find('.Select__menu')
              .should('be.visible')
              .find('.Select__option')
              .contains(firstOrganization.name)
              .click();
          });

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

          cy.wait('@postRegistration')
            .its('request.body')
            .should((body) => {
              expect(body.role).to.equal('Prescripteur');
            });

          // OTP puis complétion anticipée : le back marque l'onboarding COMPLETED
          // à la création du compte → redirection directe vers le backoffice
          cy.intercept('GET', '/current', {
            fixture: 'auth-current-referer-res',
          }).as('currentIdentity');

          cy.get('input[inputmode="numeric"]').should('have.length', 6);
          // La saisie du 6e chiffre déclenche la vérification automatiquement
          cy.get('input[inputmode="numeric"]').first().type('123456');
          cy.wait('@verifyOtp');

          cy.url().should('include', '/backoffice/dashboard');
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

    it('should resume mid-way through the manual profile path on the formations step', () => {
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

      // Reprise en plein milieu du chemin manuel : situation sociale, photo,
      // cv-choice, présentation et expériences déjà complétées, formations pas
      // encore renseignées — la reprise doit s'arrêter précisément là, sans
      // sauter à l'étape suivante ni revenir en arrière.
      cy.intercept('GET', '/current/profile/complete', {
        statusCode: 200,
        body: {
          id: '00000000-0000-0000-0000-000000000001',
          hasPicture: true,
          hasExternalCv: false,
          description: 'Je cherche un poste dans la vente.',
          linkedinUrl: null,
          department: null,
          isAvailable: true,
          currentJob: null,
          optInRecommendations: false,
          nudges: [],
          sectorOccupations: [],
          allowPhysicalEvents: true,
          allowRemoteEvents: true,
          experiences: [{ title: 'Vendeur', skills: [] }],
          formations: [],
          skills: [],
          contracts: [],
          reviews: [],
          interests: [],
          customNudges: [],
          userProfileLanguages: [],
          hasExtractedCvData: false,
        },
      }).as('currentProfileComplete');

      cy.visit('/wizard/run');

      cy.contains('Vos formations');
    });

    it('should advance to the presentation step when choosing to fill the profile manually from cv-choice', () => {
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

      // Situation sociale et photo déjà complétées, profil pas encore commencé :
      // arrivée directe sur cv-choice, sans état stubé à mi-parcours.
      cy.intercept('GET', '/current/profile/complete', {
        statusCode: 200,
        body: {
          id: '00000000-0000-0000-0000-000000000001',
          hasPicture: true,
          hasExternalCv: false,
          description: null,
          linkedinUrl: null,
          department: null,
          isAvailable: true,
          currentJob: null,
          optInRecommendations: false,
          nudges: [],
          sectorOccupations: [],
          allowPhysicalEvents: true,
          allowRemoteEvents: true,
          experiences: [],
          formations: [],
          skills: [],
          contracts: [],
          reviews: [],
          interests: [],
          customNudges: [],
          userProfileLanguages: [],
          hasExtractedCvData: false,
        },
      }).as('currentProfileComplete');

      cy.visit('/wizard/run');

      cy.contains('Deux façons de faire');
      cy.contains('button', 'Le remplir moi-même').click();

      cy.contains('Présentez-vous en quelques lignes');
    });

    it('should advance to the cv-loading step when uploading a CV from cv-choice', () => {
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

      cy.intercept('GET', '/current/profile/complete', {
        statusCode: 200,
        body: {
          id: '00000000-0000-0000-0000-000000000001',
          hasPicture: true,
          hasExternalCv: false,
          description: null,
          linkedinUrl: null,
          department: null,
          isAvailable: true,
          currentJob: null,
          optInRecommendations: false,
          nudges: [],
          sectorOccupations: [],
          allowPhysicalEvents: true,
          allowRemoteEvents: true,
          experiences: [],
          formations: [],
          skills: [],
          contracts: [],
          reviews: [],
          interests: [],
          customNudges: [],
          userProfileLanguages: [],
          hasExtractedCvData: false,
        },
      }).as('currentProfileComplete');

      cy.intercept('POST', '/external-cv', { statusCode: 201, body: {} }).as(
        'postExternalCv'
      );

      cy.visit('/wizard/run');

      cy.contains('Deux façons de faire');
      cy.get('input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from('%PDF-1.4 fake cv content'),
          fileName: 'cv.pdf',
          mimeType: 'application/pdf',
        },
        { force: true }
      );
      cy.wait('@postExternalCv');

      cy.contains('Votre profil est en cours de génération');
    });

    it('should display an error message when the social situation save fails', () => {
      cy.intercept('GET', '/current', {
        fixture: 'auth-current-candidate-onboarding-not-started-res',
      }).as('currentIdentity');
      cy.intercept('PUT', '/users/social-situations/**', {
        statusCode: 500,
        body: {},
      }).as('updateSocialSituation');

      cy.visit('/wizard/run');
      cy.contains('Quelques infos pour vous proposer le bon soutien');

      // Tous les champs sont facultatifs : la soumission part directement
      cy.get('[data-testid="wizard-next-step-btn"]').click();
      cy.wait('@updateSocialSituation');

      // L'échec de sauvegarde est signalé et on reste sur l'étape
      cy.get('[data-testid="wizard-step-error"]')
        .should('be.visible')
        .and('contain', 'Une erreur est survenue');
      cy.contains('Quelques infos pour vous proposer le bon soutien');
    });

    it('should be redirected to the dashboard when the onboarding is already completed', () => {
      cy.intercept('GET', '/current', {
        fixture: 'auth-current-candidate-onboarding-completed-res',
      }).as('currentIdentity');

      cy.visit('/wizard/run');

      cy.url().should('include', '/backoffice/dashboard');
    });

    describe('Etant donné que je suis arrivé sur le récapitulatif de match', () => {
      beforeEach(() => {
        // Toutes les étapes précédentes doivent être complétées pour que
        // determineStartingStep résolve directement sur "match-recap".
        cy.fixture('auth-current-candidate-onboarding-not-started-res').then(
          (user) => {
            cy.intercept('GET', '/current', {
              statusCode: 200,
              body: {
                ...user,
                onboardingStatus: 'in_progress',
                userSocialSituation: { hasCompletedSurvey: true },
                // Évite d'avoir à stubber /events* pour l'étape "webinar"
                onboardingWebinarSkippedAt: '2026-01-01T00:00:00.000Z',
              },
            }).as('currentIdentity');
          }
        );

        cy.intercept('GET', '/current/profile/complete', {
          statusCode: 200,
          body: {
            id: '00000000-0000-0000-0000-000000000001',
            hasPicture: true,
            hasExternalCv: true,
            description: 'Je cherche un poste dans la vente.',
            linkedinUrl: null,
            department: null,
            isAvailable: true,
            currentJob: null,
            optInRecommendations: false,
            nudges: [],
            sectorOccupations: [],
            allowPhysicalEvents: true,
            allowRemoteEvents: true,
            experiences: [],
            formations: [],
            skills: [],
            contracts: [],
            reviews: [],
            interests: [],
            customNudges: [],
            userProfileLanguages: [],
            hasExtractedCvData: false,
          },
        }).as('currentProfileComplete');

        // Le stub par défaut de wizardJourneyRequests renvoie une liste vide,
        // ce qui laisserait l'étape "elearning" incomplète.
        cy.intercept('GET', '/elearning/units*', {
          statusCode: 200,
          body: [
            {
              id: 'elearning-unit-1',
              createdAt: '2026-01-01T00:00:00.000Z',
              updatedAt: '2026-01-01T00:00:00.000Z',
              title: 'Unité complétée',
              description: '',
              durationMinutes: 5,
              videoUrl: '',
              questions: [],
              roles: [],
              userCompletions: [
                {
                  id: 'elearning-completion-1',
                  userId: '4d3c885c-4859-4e7b-a428-902812964f08',
                  unitId: 'elearning-unit-1',
                  validatedAt: '2026-01-01T00:00:00.000Z',
                },
              ],
            },
          ],
        }).as('elearningUnits');

        cy.fixture('public-profile-res').then((profile) => {
          cy.intercept('GET', '/user/profile/recommendations*', {
            statusCode: 200,
            body: {
              embeddingPending: false,
              nextCursor: null,
              recommendations: [
                {
                  id: 'reco-1',
                  publicProfile: { ...profile, role: 'Coach' },
                  reason: null,
                },
              ],
            },
          }).as('profilesRecommendations');

          cy.intercept('GET', `/user/profile/${profile.id}`, {
            statusCode: 200,
            body: { ...profile, role: 'Coach' },
          }).as('publicUserProfile');
        });

        cy.intercept('PUT', '/user/*', { statusCode: 200 }).as(
          'putUserOnboardingStatus'
        );

        cy.visit('/wizard/run');
        cy.contains(
          'Félicitations ! Vous pouvez dès à présent contacter des coachs'
        );
      });

      it('should redirect to the filtered network directory when clicking "Voir les autres coachs"', () => {
        cy.get('[data-testid="wizard-match-recap-secondary-cta"]').click();

        cy.wait('@putUserOnboardingStatus');

        cy.url().should('include', '/backoffice/annuaire');
        cy.url().should('include', 'entity=user');
        cy.url().should('include', 'role=Coach');
        cy.url().should('not.include', '/backoffice/dashboard');
      });
    });
  });
});
