import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import { onboardingJourneyRequests } from '../../intercept/journey/onboarding.req';
import bootstrap from '../bootstrap';

const interceptGenericBackofficeRequests = () => {
  interceptCurrentUserSubResources();

  cy.intercept('GET', '/messaging/conversations/unseen-count', {
    statusCode: 200,
    body: 0,
  }).as('unseenConversationsCount');

  cy.intercept('GET', '/user/profile/completion', {
    statusCode: 200,
    body: 0,
  }).as('profileCompletion');

  cy.intercept('GET', '/user/profile/recommendations?*', {
    statusCode: 200,
    body: {
      recommendations: [],
      nextCursor: null,
    },
  });

  const urlsToIntercept = [
    '/messaging/conversations',
    '/messaging/conversations/**',
  ];

  urlsToIntercept.forEach((url) => {
    ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].forEach((method) => {
      cy.intercept({ method, url }, { statusCode: 200, body: [] });
    });
  });
};

const interceptOnboardingApis = () => {
  onboardingJourneyRequests.GET.forEach((request) => {
    if (request.alias) {
      cy.intercept('GET', request.path, request.data).as(request.alias);
    } else {
      cy.intercept('GET', request.path, request.data);
    }
  });

  // Departments: needed by WebinarSelection in the completion modal
  cy.intercept('GET', '/departments*', {
    statusCode: 200,
    body: [],
  });

  // Events: loaded in the completion modal's WebinarSelection component
  cy.intercept('GET', '/events*', {
    statusCode: 200,
    body: [
      {
        salesForceId: 'sf-webinar-1',
        startDate: '2030-01-15T10:00:00.000Z',
        duration: 60,
        mode: 'online',
      },
    ],
  }).as('events');

  cy.intercept('PUT', '/events/**/participation', {
    statusCode: 200,
    body: {},
  }).as('webinarParticipation');

  // Elearning units: make them "already completed" so the step is unblocked.
  cy.intercept('GET', '/elearning/units*', {
    statusCode: 200,
    body: [
      {
        id: 'unit-1',
        title: 'Module 1',
        description: 'Comprendre le rôle',
        durationMinutes: 1,
        userCompletions: [{ id: 'completion-1' }],
      },
    ],
  }).as('elearningUnits');

  // Social situation
  cy.intercept('GET', '/users/social-situations*', {
    statusCode: 200,
    body: {
      hasCompletedSurvey: true,
    },
  });
  cy.intercept('PUT', '/users/social-situations/**', {
    statusCode: 200,
    body: {},
  }).as('updateSocialSituation');

  // Profile updates (nudges + profile completion)
  cy.intercept('PUT', '/user/profile/**', {
    statusCode: 200,
    body: {},
  }).as('updateProfile');

  // Onboarding status updates + webinar skip
  cy.intercept('PUT', '/user/*', {
    statusCode: 200,
    body: {},
  }).as('updateUser');
};

// Goes through all visible onboarding steps and lands on the completion modal.
// Step order: nudges → elearning (skipped, units already completed) → social situation → profile completion.
// Must be called after visiting /backoffice/dashboard and waiting for the redirect.
const completeOnboardingSteps = () => {
  // Start onboarding (sets onboardingStatus=in_progress => redirect to /run)
  cy.contains('button', 'Commencer le parcours').click();
  cy.wait('@updateUser');
  cy.url().should('include', '/backoffice/onboarding/run');

  // Step 1: Nudges - first visible step, pick one nudge and submit
  cy.wait('@nudges');
  cy.get('[data-testid^="nudgeIds-"]').first().click();
  cy.get('[data-testid="onboarding-next-step-btn"]').click();
  cy.wait('@updateProfile');
  cy.get('[data-testid="nudges-confirmation-submit-btn"]').click();

  // Step 2: Elearning - units already completed in fixture so Next is enabled immediately
  cy.wait('@elearningUnits');
  cy.get('[data-testid="onboarding-next-step-btn"]').click();
  cy.get('[data-testid="elearning-confirmation-submit-btn"]').click();

  // Step 3: Social situation - submit empty optional form
  cy.get('[data-testid="onboarding-next-step-btn"]').click();
  cy.wait('@updateSocialSituation');
  cy.get('[data-testid="social-situation-confirmation-submit-btn"]').click();

  // Step 4: Profile completion - fill required fields
  cy.get(
    '[data-testid="form-onboarding-profile-completion-introduction"]'
  ).type(
    "Je suis en recherche d'emploi et je souhaite être accompagné(e) pour clarifier mon projet professionnel et améliorer mes candidatures."
  );

  // Open accordion and fill the fields
  cy.get('[data-testid="professional-info-accordion-header"]').click();

  // Open the business sector select
  cy.get('#form-onboarding-profile-completion-businessSectorId0').click();

  // Wait for the options to be loaded
  cy.wait('@businessSectors');

  // Select the first option
  cy.get('#form-onboarding-profile-completion-businessSectorId0')
    .find('.Select__menu')
    .should('be.visible')
    .find('.Select__option')
    .first()
    .click();

  cy.get('[data-testid="onboarding-next-step-btn"]').click();
  cy.wait('@updateProfile');
  // The completion modal now opens
};

describe('Onboarding - Journey', () => {
  bootstrap();

  beforeEach(() => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', '1234');

    cy.log(
      'Setting up intercepts for generic backoffice requests and onboarding APIs'
    );
    interceptGenericBackofficeRequests();
    interceptOnboardingApis();
  });

  it('Should redirect to onboarding when it is not completed', () => {
    cy.intercept('GET', '/current', {
      fixture: 'auth-current-candidate-onboarding-not-started-res',
    }).as('currentIdentity');

    cy.visit('/backoffice/dashboard');
    cy.wait('@currentIdentity');

    cy.url().should('include', '/backoffice/onboarding');
  });

  it('Should not redirect to onboarding when it is already completed', () => {
    cy.intercept('GET', '/current', {
      fixture: 'auth-current-candidate-onboarding-completed-res',
    }).as('currentIdentity');

    cy.visit('/backoffice/dashboard');
    cy.wait('@currentIdentity');

    cy.url().should('include', '/backoffice/dashboard');
    cy.contains('Bienvenue sur votre tableau de bord');
  });

  it('Should complete a light candidate onboarding flow and reserve a webinar', () => {
    cy.intercept('GET', '/current', {
      fixture: 'auth-current-candidate-onboarding-not-started-res',
    }).as('currentIdentity');

    cy.visit('/backoffice/dashboard');
    cy.wait('@currentIdentity');
    cy.url().should('include', '/backoffice/onboarding');

    completeOnboardingSteps();

    // Completion modal: select a webinar date and reserve
    cy.wait('@events');
    cy.get('[data-testid="webinarSfId-sf-webinar-1"]').click();
    cy.get('[data-testid="onboarding-completion-submit-btn"]').click();
    cy.wait('@webinarParticipation');
    cy.wait('@updateUser');

    cy.url().should('include', '/backoffice/dashboard');
    cy.contains('Bienvenue sur votre tableau de bord');
  });

  it('Should complete a light candidate onboarding flow and skip the webinar', () => {
    cy.intercept('GET', '/current', {
      fixture: 'auth-current-candidate-onboarding-not-started-res',
    }).as('currentIdentity');

    cy.visit('/backoffice/dashboard');
    cy.wait('@currentIdentity');
    cy.url().should('include', '/backoffice/onboarding');

    completeOnboardingSteps();

    // Completion modal: skip the webinar
    cy.wait('@events');
    cy.contains('button', 'Plus tard, depuis mon espace').click();
    cy.wait('@updateUser'); // PUT /user/{id} with onboardingWebinarSkippedAt
    cy.wait('@updateUser'); // onboarding status = COMPLETED

    cy.url().should('include', '/backoffice/dashboard');
    cy.contains('Bienvenue sur votre tableau de bord');
  });
});
