import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import bootstrap from '../e2e/test/bootstrap';
import { buildCurrentUser } from '../fixtures/src/messaging/messagingBuilders';

const ADMIN_ID = '00000000-0000-0000-0000-0000000000ad';

describe("Page profil d'un admin", () => {
  bootstrap();

  const interceptAdminProfile = () => {
    cy.fixture('public-profile-res').then((profile) => {
      cy.intercept('GET', `/user/profile/${ADMIN_ID}`, {
        statusCode: 200,
        body: {
          ...profile,
          id: ADMIN_ID,
          firstName: 'Camille',
          lastName: 'Admin',
          role: 'Admin',
          hasPicture: false,
          achievements: [],
          experiences: [],
          formations: [],
          skills: [],
          contracts: [],
          interests: [],
          customNudges: [],
          nudges: [],
          userProfileLanguages: [],
          elearningCompletedAt: '2024-01-01T00:00:00.000Z',
        },
      }).as('getAdminProfile');
    });
  };

  beforeEach(() => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptCurrentUserSubResources();
    interceptAdminProfile();
  });

  it('candidat qui consulte le profil d’un admin', () => {
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({ role: 'Candidat' }),
    });

    cy.visit(`/backoffice/profile/${ADMIN_ID}`);
    cy.wait('@getCurrent');
    cy.wait('@getAdminProfile');
    cy.contains("J'ai du réseau dans").should('be.visible');

    cy.capture('Profil admin vu par un candidat', {
      caption: 'Wording coach : « J’ai du réseau dans », bloc Contacter.',
    });
  });

  it('admin sur son propre profil', () => {
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({ id: ADMIN_ID, role: 'Admin' }),
    });

    cy.visit(`/backoffice/profile/${ADMIN_ID}`);
    cy.wait('@getCurrent');
    cy.wait('@getAdminProfile');
    cy.contains("J'ai du réseau dans").should('be.visible');

    cy.capture('Profil admin vu par lui-même');
  });

  it('admin dans ses paramètres', () => {
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({ id: ADMIN_ID, role: 'Admin' }),
    });

    cy.visit('/backoffice/parametres');
    cy.wait('@getCurrent');
    cy.wait('@currentProfileComplete');
    cy.contains('Notifications email').should('be.visible');
    cy.contains('recommandations de candidats').should('be.visible');

    cy.capture('Paramètres admin', {
      caption: 'Préférence de notifications formulée comme pour un coach.',
    });
  });
});
