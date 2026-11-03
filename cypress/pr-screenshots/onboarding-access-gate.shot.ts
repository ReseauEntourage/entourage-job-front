import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { onboardingJourneyRequests } from '../e2e/intercept/journey/onboarding.req';
import { wizardJourneyRequests } from '../e2e/intercept/journey/wizard.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import bootstrap from '../e2e/test/bootstrap';
import {
  buildCurrentUser,
  CURRENT_USER_ID,
} from '../fixtures/src/messaging/messagingBuilders';

// A candidate with an unfinished onboarding, sent to the wizard from the
// events page: the photo is set and the social situation answered, so the
// wizard resumes on the profile step (no CV, no experience, no formation).
const interceptOnboarding = () => {
  interceptCurrentUser({
    statusCode: 200,
    body: buildCurrentUser({
      id: CURRENT_USER_ID,
      role: 'Candidat',
      onboardingStatus: 'not_started',
      onboardingCompletedAt: null,
    }),
  });
  interceptCurrentUserSubResources();
  [...onboardingJourneyRequests.GET, ...wizardJourneyRequests.GET].forEach(
    (request) => {
      cy.intercept('GET', request.path, request.data).as(request.alias);
    }
  );
  // Requested by the steps that follow the one being captured.
  cy.intercept('GET', '/events*', { statusCode: 200, body: [] });
  cy.intercept('GET', '/departments*', { statusCode: 200, body: [] });
  cy.intercept('GET', '/user/profile/recommendations*', {
    statusCode: 200,
    body: { embeddingPending: false, nextCursor: null, recommendations: [] },
  });
  cy.intercept('GET', '/current/profile/complete', {
    statusCode: 200,
    body: {
      id: CURRENT_USER_ID,
      hasPicture: true,
      hasExternalCv: false,
      description: null,
      linkedinUrl: null,
      department: null,
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
  cy.intercept('PUT', `/user/${CURRENT_USER_ID}`, {
    statusCode: 200,
    body: {},
  }).as('putUser');
};

describe("Onboarding - accès à l'espace et étape profil passable", () => {
  bootstrap();

  it('renvoyé depuis les événements, le candidat voit le message et peut passer son profil', () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptOnboarding();

    cy.visit('/wizard/run?requestedPath=%2Fbackoffice%2Fevents');
    cy.wait('@currentProfileComplete');
    cy.contains('Construisons votre profil').should('be.visible');
    cy.contains('Terminez votre profil pour accéder à votre espace').should(
      'be.visible'
    );
    cy.contains('button', 'Je le remplis plus tard').should('be.visible');

    cy.capture('Étape profil - message et trois actions', {
      caption:
        "Renvoyé depuis la page des événements : message « Terminez votre profil pour accéder à votre espace » et troisième action « Je le remplis plus tard », pour les candidats comme pour les coachs.",
      capture: 'viewport',
    });

    cy.contains('button', 'Je le remplis plus tard').click();
    cy.wait('@putUser')
      .its('request.body')
      .should('have.property', 'onboardingProfileSkippedAt');
    cy.contains('Construisons votre profil').should('not.exist');

    cy.capture('Après « Je le remplis plus tard »', {
      caption:
        "Le wizard passe directement à l'étape suivante. Sur desktop, la section Profil du stepper est « passée » (bordure en pointillés), distincte de « complétée », sans alerte.",
      capture: 'viewport',
    });
  });
});
