import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { onboardingJourneyRequests } from '../e2e/intercept/journey/onboarding.req';
import { wizardJourneyRequests } from '../e2e/intercept/journey/wizard.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import bootstrap from '../e2e/test/bootstrap';
import {
  buildCurrentUser,
  CURRENT_USER_ID,
} from '../fixtures/src/messaging/messagingBuilders';

// 1x1 solid blue PNG, scaled up by the round badge once selected.
const PHOTO_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOMX2/3HwAFQAKxkQhUmQAAAABJRU5ErkJggg==';

// No photo saved: the wizard starts on the photo step.
const interceptOnboardingWithoutPhoto = (role: 'Candidat' | 'Coach') => {
  interceptCurrentUser({
    statusCode: 200,
    body: buildCurrentUser({
      id: CURRENT_USER_ID,
      role,
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
  cy.intercept('GET', '/current/profile/complete', {
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
};

describe('Onboarding - encart de visibilité à l’étape photo', () => {
  bootstrap();

  beforeEach(() => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
  });

  it('un candidat sans photo voit l’encart sous les boutons photo', () => {
    interceptOnboardingWithoutPhoto('Candidat');

    cy.visit('/wizard/run');
    cy.wait('@currentProfileComplete');
    cy.contains('Commençons par une photo de vous').should('be.visible');
    cy.get('[data-testid="photo-visibility-hint"]')
      .should('be.visible')
      .and('contain', 'contactés par des coachs');

    cy.capture('Étape photo - candidat sans photo', {
      caption:
        'L’encart est visible sous les boutons photo, l’étape reste facultative.',
      capture: 'viewport',
    });
  });

  it('un coach sans photo voit l’encart sous les boutons photo', () => {
    interceptOnboardingWithoutPhoto('Coach');

    cy.visit('/wizard/run');
    cy.wait('@currentProfileComplete');
    cy.contains('Commençons par une photo de vous').should('be.visible');
    cy.get('[data-testid="photo-visibility-hint"]')
      .should('be.visible')
      .and('contain', 'contactés par des candidats');

    cy.capture('Étape photo - coach sans photo', {
      caption:
        'Même encart, formulé pour un coach (contacté par des candidats).',
      capture: 'viewport',
    });
  });

  it('l’encart disparaît dès qu’une photo est sélectionnée', () => {
    interceptOnboardingWithoutPhoto('Candidat');

    cy.visit('/wizard/run');
    cy.wait('@currentProfileComplete');
    cy.get('[data-testid="photo-visibility-hint"]').should('be.visible');

    cy.get('input[type="file"]:not([capture])').selectFile(
      {
        contents: Cypress.Buffer.from(PHOTO_PNG_BASE64, 'base64'),
        fileName: 'photo.png',
        mimeType: 'image/png',
      },
      { force: true }
    );
    cy.get('[data-testid="photo-visibility-hint"]').should('not.exist');

    cy.capture('Étape photo - photo sélectionnée', {
      caption: 'La photo est affichée dans le badge et l’encart a disparu.',
      capture: 'viewport',
    });
  });
});
