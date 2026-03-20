import { onboardingJourneyRequests } from '../../intercept/journey/onboarding.req';
import bootstrap from '../bootstrap';

const interceptGenericBackofficeRequests = () => {
  // Dashboard/background calls that can happen during onboarding redirects
  cy.intercept('GET', '/auth/current/staff-contact', {
    statusCode: 200,
    body: {
      name: 'Support Entourage Pro',
      email: 'support@entourage.social',
      img: '/static/img/profile-placeholder.png',
    },
  }).as('staffContact');

  cy.intercept('GET', '/messaging/conversations/unseen-count', {
    statusCode: 200,
    body: 0,
  }).as('unseenConversationsCount');

  cy.intercept('GET', '/user/profile/completion', {
    statusCode: 200,
    body: 0,
  }).as('profileCompletion');

  const urlsToIntercept = [
    '/messaging/conversations',
    '/messaging/conversations/**',
    '/user/profile/recommendations**',
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

  // Departments: needed when the user has a department in their profile
  cy.intercept('GET', '/departments*', {
    statusCode: 200,
    body: [],
  });

  // Webinar: return options for the date picker, but return an empty list for
  // the “already registered” check (isParticipating=true).
  const webinarEvent = {
    salesForceId: 'sf-webinar-1',
    startDate: '2030-01-15T10:00:00.000Z',
    duration: 60,
    mode: 'online',
  };

  cy.intercept('GET', '/events*', (req) => {
    const url = new URL(req.url);
    const isParticipating = url.searchParams.get('isParticipating');

    if (isParticipating === 'true') {
      req.reply({ statusCode: 200, body: [] });
      return;
    }

    req.reply({ statusCode: 200, body: [webinarEvent] });
  }).as('events');

  cy.intercept('PUT', '/events/**/participation', {
    statusCode: 200,
    body: {},
  }).as('webinarParticipation');

  // Elearning units: make them “already completed” so the step is unblocked.
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

  // Onboarding status updates
  cy.intercept('PUT', '/user/*', {
    statusCode: 200,
    body: {},
  }).as('updateUser');
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
    cy.intercept('GET', '/auth/current*', {
      fixture: 'auth-current-candidate-onboarding-not-started-res',
    }).as('authCurrent');

    cy.visit('/backoffice/dashboard');
    cy.wait('@authCurrent');

    cy.url().should('include', '/backoffice/onboarding');
  });

  it('Should not redirect to onboarding when it is already completed', () => {
    cy.intercept('GET', '/auth/current*', {
      fixture: 'auth-current-candidate-onboarding-completed-res',
    }).as('authCurrent');

    cy.visit('/backoffice/dashboard');
    cy.wait('@authCurrent');

    cy.url().should('include', '/backoffice/dashboard');
    cy.contains('Bienvenue sur votre tableau de bord');
  });

  it('Should complete a light candidate onboarding flow', () => {
    cy.intercept('GET', '/auth/current*', {
      fixture: 'auth-current-candidate-onboarding-not-started-res',
    }).as('authCurrent');

    cy.visit('/backoffice/dashboard');
    cy.wait('@authCurrent');
    cy.url().should('include', '/backoffice/onboarding');

    // Start onboarding (sets onboardingStatus=in_progress => redirect to /run)
    cy.contains('button', 'Commencer le parcours').click();
    cy.wait('@updateUser');
    cy.url().should('include', '/backoffice/onboarding/run');

    // Step 1: Webinar - select the only option and submit
    cy.wait('@events');
    cy.get('[data-testid="webinarSfId-sf-webinar-1"]').click();
    cy.get('[data-testid="onboarding-next-step-btn"]').click();
    cy.wait('@webinarParticipation');
    cy.contains('button', 'Passer à l’étape suivante').click();

    // Step 2: Elearning - already completed
    cy.wait('@elearningUnits');
    cy.get('[data-testid="onboarding-next-step-btn"]').click();
    cy.contains('button', 'Passer à l’étape suivante').click();

    // Step 3: Social situation - submit empty optional form
    cy.get('[data-testid="onboarding-next-step-btn"]').click();
    cy.wait('@updateSocialSituation');
    cy.get(
      '[data-testid="social-situation-onboarding-success-submit-btn"]'
    ).click();

    // Step 4: Nudges - pick one nudge and submit
    cy.wait('@nudges');
    cy.get('[data-testid^="nudgeIds-"]').first().click();
    cy.get('[data-testid="onboarding-next-step-btn"]').click();
    cy.wait('@updateProfile');
    cy.contains('button', 'Passer à l’étape suivante').click();

    // Step 5: Profile completion - fill required fields
    cy.get(
      '[data-testid="form-onboarding-profile-completion-introduction"]'
    ).type(
      'Je suis en recherche d’emploi et je souhaite être accompagné(e) pour clarifier mon projet professionnel et améliorer mes candidatures.'
    );

    // Open accordion and fill the fields
    cy.get('[data-testid="professional-info-accordion-header"]').click();

    // Open the business sector select
    cy.get('#form-onboarding-profile-completion-businessSectorId0').click();

    // Wait the options to be loaded
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

    cy.contains('button', 'Démarrer l’aventure Entourage Pro').click();
    cy.wait('@updateUser');

    cy.url().should('include', '/backoffice/dashboard');
    cy.contains('Bienvenue sur votre tableau de bord');
  });
});
