import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { onboardingJourneyRequests } from '../e2e/intercept/journey/onboarding.req';
import { wizardJourneyRequests } from '../e2e/intercept/journey/wizard.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import bootstrap from '../e2e/test/bootstrap';
import {
  buildCurrentUser,
  CURRENT_USER_ID,
} from '../fixtures/src/messaging/messagingBuilders';

// Every step before the webinar is done, so the wizard resumes directly on
// the invitation to the welcome meeting.
const COMPLETED_PROFILE = {
  id: CURRENT_USER_ID,
  hasPicture: true,
  hasExternalCv: true,
  description: 'Je cherche un poste dans la vente.',
  linkedinUrl: null,
  department: 'Nord (59)',
  unavailableAt: null,
  currentJob: null,
  optInRecommendations: false,
  nudges: [],
  sectorOccupations: [],
  allowPhysicalEvents: true,
  allowRemoteEvents: true,
};

const COMPLETED_ELEARNING_UNIT = {
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
      userId: CURRENT_USER_ID,
      unitId: 'elearning-unit-1',
      validatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
};

const WEBINARS = [
  {
    salesForceId: 'webinar-online-1',
    name: 'Réunion de bienvenue',
    description: '',
    startDate: '2026-12-10T10:00:00.000Z',
    endDate: '2026-12-10T11:00:00.000Z',
    eventType: 'WELCOME_SESSION',
    participantsCount: 0,
    registrationCount: 0,
    mode: 'online',
    meetingLink: null,
    fullAddress: null,
    duration: 60,
    isParticipating: false,
    publicSensibilise: null,
  },
  {
    salesForceId: 'webinar-online-2',
    name: 'Réunion de bienvenue',
    description: '',
    startDate: '2026-12-17T10:00:00.000Z',
    endDate: '2026-12-17T11:00:00.000Z',
    eventType: 'WELCOME_SESSION',
    participantsCount: 0,
    registrationCount: 0,
    mode: 'online',
    meetingLink: null,
    fullAddress: null,
    duration: 60,
    isParticipating: false,
    publicSensibilise: null,
  },
];

// A candidate whose onboarding is still "in progress": the wizard resumes on
// the webinar invitation.
const interceptOnboardingBeforeTheWebinar = () => {
  interceptCurrentUser({
    statusCode: 200,
    body: buildCurrentUser({
      id: CURRENT_USER_ID,
      role: 'Candidat',
      onboardingStatus: 'in_progress',
      onboardingCompletedAt: null,
      onboardingWebinarSkippedAt: null,
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
    body: COMPLETED_PROFILE,
  }).as('currentProfile');
  cy.intercept('GET', '/current/profile/complete', {
    statusCode: 200,
    body: {
      ...COMPLETED_PROFILE,
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
  // The default stub of the wizard journey has no unit, which would skip the
  // step: a completed unit keeps the step done, like for a real account.
  cy.intercept('GET', '/elearning/units*', {
    statusCode: 200,
    body: [COMPLETED_ELEARNING_UNIT],
  }).as('elearningUnits');
  cy.intercept('GET', '/departments*', {
    statusCode: 200,
    body: [{ id: 'department-59', name: 'Nord (59)' }],
  }).as('departments');
  // No reservation yet (the step is not done), and the next welcome meetings
  // to choose from.
  cy.intercept('GET', '/events*', (req) => {
    req.reply({
      statusCode: 200,
      body: req.query.isParticipating === 'true' ? [] : WEBINARS,
    });
  }).as('getEvents');
  // Completion of the onboarding, then the webinar skip.
  cy.intercept('PUT', '/users/*', { statusCode: 200 }).as('putUser');
};

const interceptRecap = () => {
  cy.fixture('public-profile-res').then((profile) => {
    cy.intercept('GET', '/current/profile/recommendations*', {
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
    cy.intercept('GET', `/users/${profile.id}/profile`, {
      statusCode: 200,
      body: { ...profile, role: 'Coach' },
    }).as('publicUserProfile');
  });
};

describe('Onboarding - terminé dès l’arrivée sur l’invitation à la réunion de bienvenue', () => {
  bootstrap();

  beforeEach(() => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
  });

  it('l’invitation reste affichée une fois l’onboarding marqué terminé', () => {
    interceptOnboardingBeforeTheWebinar();

    cy.visit('/wizard/run');
    cy.wait('@getEvents');
    cy.contains('Venez à la réunion de bienvenue').should('be.visible');

    // The onboarding is completed on arrival, without waiting for a click.
    cy.wait('@putUser')
      .its('request.body')
      .should('deep.equal', { onboardingStatus: 'completed' });

    // No redirect to the dashboard: the person keeps going through the wizard.
    cy.location('pathname').should('eq', '/wizard/run');
    cy.contains('Venez à la réunion de bienvenue').should('be.visible');

    cy.capture('Invitation - onboarding déjà terminé', {
      caption:
        'L’onboarding est marqué terminé dès l’arrivée sur l’invitation, et l’écran reste affiché : le parcours est inchangé pour la personne.',
      capture: 'viewport',
    });
  });

  it('le récap s’affiche ensuite, puis la fin du wizard mène au tableau de bord', () => {
    interceptOnboardingBeforeTheWebinar();
    interceptRecap();

    cy.visit('/wizard/run');
    cy.wait('@getEvents');
    cy.contains('Venez à la réunion de bienvenue').should('be.visible');
    cy.wait('@putUser');

    cy.contains('button', 'Plus tard').click();
    cy.wait('@putUser')
      .its('request.body')
      .should('have.property', 'onboardingWebinarSkippedAt');

    cy.contains(
      'Félicitations ! Vous pouvez dès à présent contacter des coachs'
    ).should('be.visible');
    cy.location('pathname').should('eq', '/wizard/run');

    cy.capture('Récap - onboarding déjà terminé', {
      caption:
        'Le récap suit l’invitation, comme avant. L’onboarding est déjà terminé : ses boutons ne l’écrivent plus.',
      capture: 'viewport',
    });
  });
});
