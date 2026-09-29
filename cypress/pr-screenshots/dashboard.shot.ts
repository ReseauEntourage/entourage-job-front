import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import {
  interceptGetConversations,
  interceptGetUnseenCount,
} from '../e2e/intercept/user/messaging.req';
import bootstrap from '../e2e/test/bootstrap';
import { buildCurrentUser } from '../fixtures/src/messaging/messagingBuilders';

describe('Tableau de bord', () => {
  bootstrap();

  before(() => {
    cy.generateConversationsApiResponse(5);
  });

  it('coach connecté avec des conversations', () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({ role: 'Coach' }),
    });
    interceptCurrentUserSubResources();
    interceptGetUnseenCount({ statusCode: 200, body: 0 });
    interceptGetConversations({ fixture: 'api/generated/conversations' });
    cy.fixture('public-profile-res').then((profile) => {
      cy.intercept('GET', '/user/profile/recommendations*', {
        statusCode: 200,
        body: {
          embeddingPending: false,
          nextCursor: null,
          recommendations: [1, 2, 3].map((index) => ({
            id: `reco-${index}`,
            publicProfile: {
              ...profile,
              id: `${profile.id}-${index}`,
              role: 'Candidate',
            },
            reason: null,
          })),
        },
      }).as('getRecommendations');
    });

    cy.visit('/backoffice/dashboard');
    // Wait for the state to show BEFORE capturing (data loaded, modal open…).
    cy.wait('@getCurrent');
    cy.wait('@getConversations');
    cy.wait('@getRecommendations');
    cy.get('[data-testid="dashboard-messaging-widget"]').should('be.visible');

    cy.capture('Tableau de bord');
    cy.get('[data-testid="dashboard-messaging-widget"]').capture(
      'Widget messagerie',
      { caption: 'Les 3 conversations les plus récentes.' }
    );
  });
});
