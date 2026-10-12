import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { onboardingJourneyRequests } from '../e2e/intercept/journey/onboarding.req';
import { wizardJourneyRequests } from '../e2e/intercept/journey/wizard.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import bootstrap from '../e2e/test/bootstrap';
import {
  buildCurrentUser,
  CURRENT_USER_ID,
} from '../fixtures/src/messaging/messagingBuilders';

const FORMATION = {
  id: 'formation-1',
  title: 'CAP Logistique',
  institution: 'AFPA Lille',
  location: 'Lille',
  description: null,
  startDate: '2019-09-01T00:00:00.000Z',
  endDate: '2020-06-30T00:00:00.000Z',
  skills: [],
};

const EXPERIENCE = {
  id: 'experience-1',
  title: 'Cariste',
  company: 'Logistique du Nord',
  location: 'Lille',
  description: null,
  startDate: '2020-09-01T00:00:00.000Z',
  endDate: '2023-06-30T00:00:00.000Z',
  skills: [],
};

// The photo is already set and the CV choice is made: the wizard resumes on
// the first step whose list is still empty.
const interceptOnboardingProfile = (profile: Record<string, unknown> = {}) => {
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
  // Requested by the steps that follow the one being captured.
  cy.intercept('GET', '/events*', { statusCode: 200, body: [] });
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
      ...profile,
    },
  }).as('currentProfileComplete');
  cy.intercept('GET', '/user/registration/compatible-profiles*', {
    statusCode: 200,
    body: [],
  });
  cy.intercept('PUT', '/user/profile/*', { statusCode: 200, body: {} }).as(
    'putProfile'
  );
};

describe('Onboarding - ajout des expériences et formations', () => {
  bootstrap();

  it("l'ajout se fait depuis la liste, vide puis non vide", () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptOnboardingProfile({ formations: [FORMATION] });

    cy.visit('/wizard/run');
    cy.wait('@currentProfileComplete');
    cy.contains('Vos expériences professionnelles').should('be.visible');
    cy.contains('button', 'Ajouter une expérience').should('be.visible');

    cy.capture('Expériences - liste vide', {
      caption:
        "Une carte en pointillés remplace le bouton d'en-tête et le texte « Aucune expérience ».",
      capture: 'viewport',
    });

    cy.contains('button', 'Ajouter une expérience').click();
    cy.capture("Expériences - modale d'ajout", {
      caption: "La carte ouvre la modale d'ajout existante, inchangée.",
      capture: 'viewport',
    });
    cy.get('body').type('{esc}');

    cy.contains('button', 'Étape suivante').click();
    cy.wait('@putProfile');
    cy.contains('Vos formations').should('be.visible');
    cy.contains('button', 'Ajouter une autre formation').should('be.visible');

    cy.capture('Formations - liste non vide', {
      caption:
        'La ligne « Ajouter une autre formation » apparaît sous la dernière carte.',
      capture: 'viewport',
    });
  });

  it("l'état vide des formations", () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptOnboardingProfile({ experiences: [EXPERIENCE] });

    cy.visit('/wizard/run');
    cy.wait('@currentProfileComplete');
    cy.contains('Vos formations').should('be.visible');
    cy.contains('button', 'Ajouter une formation').should('be.visible');

    cy.capture('Formations - liste vide', {
      caption:
        "Même carte en pointillés que les expériences, avec l'aide « Intitulé, établissement et dates. ».",
      capture: 'viewport',
    });
  });
});
