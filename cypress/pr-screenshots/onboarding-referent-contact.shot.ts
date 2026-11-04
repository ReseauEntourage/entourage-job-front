import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { onboardingJourneyRequests } from '../e2e/intercept/journey/onboarding.req';
import { wizardJourneyRequests } from '../e2e/intercept/journey/wizard.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import bootstrap from '../e2e/test/bootstrap';
import {
  buildCurrentUser,
  CURRENT_USER_ID,
} from '../fixtures/src/messaging/messagingBuilders';

const interceptOnboarding = ({ withContact }: { withContact: boolean }) => {
  interceptCurrentUser({
    statusCode: 200,
    body: buildCurrentUser({
      id: CURRENT_USER_ID,
      role: 'Candidat',
      onboardingStatus: 'in_progress',
      onboardingCompletedAt: null,
    }),
  });
  interceptCurrentUserSubResources();
  [...onboardingJourneyRequests.GET, ...wizardJourneyRequests.GET].forEach(
    (request) => {
      cy.intercept('GET', request.path, request.data).as(request.alias);
    }
  );
  cy.intercept('GET', '/current/profile', {
    statusCode: 200,
    body: {
      id: CURRENT_USER_ID,
      hasPicture: false,
      hasExternalCv: false,
      description: null,
      linkedinUrl: null,
      department: 'Nord (59)',
      unavailableAt: null,
      currentJob: null,
      optInRecommendations: false,
      nudges: [],
      sectorOccupations: [],
      allowPhysicalEvents: true,
      allowRemoteEvents: true,
    },
  }).as('currentProfile');
  cy.intercept(
    'GET',
    '/current/staff-contact',
    withContact
      ? {
          statusCode: 200,
          body: {
            name: 'Camille Martin',
            email: 'camille.martin@example.org',
            img: '/static/img/profile-placeholder.png',
          },
        }
      : { statusCode: 404 }
  ).as('currentStaffContact');
};

describe('Onboarding - contact du référent', () => {
  bootstrap();

  beforeEach(() => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
  });

  it("le bouton Besoin d'aide est visible dès la première étape", () => {
    interceptOnboarding({ withContact: true });

    cy.visit('/wizard/run');
    cy.wait('@currentStaffContact');
    cy.contains('Commençons par une photo de vous').should('be.visible');

    cy.capture('Première étape - bouton Besoin d’aide', {
      caption:
        "Desktop : bouton « Besoin d'aide ? » toujours visible en haut de l'étape, au-dessus de la ligne de flottaison. Mobile : lien « Besoin d'aide ? » sous l'en-tête.",
      capture: 'viewport',
    });

    if (Cypress.expose('device') === 'mobile') {
      // Le lien mobile ouvre directement un mailto:, pas de volet à montrer.
      return;
    }

    cy.get('[data-testid="onboarding-referent-contact"]')
      .contains("Besoin d'aide ?")
      .click();
    cy.get('[role="dialog"]').should('be.visible');

    cy.capture('Volet du contact ouvert', {
      caption:
        'Un clic sur le bouton affiche la photo, le nom, le rôle avec la zone, et l’email du référent.',
      capture: 'viewport',
    });
  });

  it("sans contact, ni bouton ni lien n'est affiché", () => {
    interceptOnboarding({ withContact: false });

    cy.visit('/wizard/run');
    cy.wait('@currentStaffContact');
    cy.contains('Commençons par une photo de vous').should('be.visible');
    cy.get('[data-testid="onboarding-referent-contact"]').should('not.exist');
    cy.get('[data-testid="onboarding-help-link"]').should('not.exist');

    cy.capture('Première étape - contact indisponible', {
      caption: "L'étape reste utilisable, sans bouton ni lien vide.",
      capture: 'viewport',
    });
  });
});
