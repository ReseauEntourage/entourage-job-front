import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import {
  interceptGetConversations,
  interceptGetUnseenCount,
} from '../e2e/intercept/user/messaging.req';
import bootstrap from '../e2e/test/bootstrap';
import { buildCurrentUser } from '../fixtures/src/messaging/messagingBuilders';

describe('Bloc de don du tableau de bord', () => {
  bootstrap();

  before(() => {
    cy.generateConversationsApiResponse(5);
  });

  it('coach connecté avec le bloc de don', () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({ role: 'Coach' }),
    });
    interceptCurrentUserSubResources();
    // The coach has a mutual exchange: the API says the block is visible
    cy.intercept('GET', '/current/donation-block', {
      statusCode: 200,
      body: { visible: true },
    }).as('getDonationBlock');
    interceptGetUnseenCount({ statusCode: 200, body: 0 });
    interceptGetConversations({ fixture: 'api/generated/conversations' });
    cy.fixture('public-profile-res').then((profile) => {
      cy.intercept('GET', '/current/profile/recommendations*', {
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
    // Wait for the state to show BEFORE capturing (data loaded, block shown…)
    cy.wait('@getCurrent');
    cy.wait('@getConversations');
    cy.wait('@getRecommendations');
    cy.wait('@getDonationBlock');
    cy.get('[data-testid="dashboard-donation-block"]').should('be.visible');

    cy.capture('Tableau de bord avec le bloc de don', {
      caption: 'Le bloc de don apparaît juste après les recommandations.',
    });
    cy.get('[data-testid="dashboard-donation-block"]').capture('Bloc de don', {
      caption:
        'Empilé sous 560 px de conteneur, bouton à droite du texte au-delà ; la croix ferme le bloc pour de bon.',
    });
  });
});
