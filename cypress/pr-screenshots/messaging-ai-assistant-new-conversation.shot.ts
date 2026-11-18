import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import {
  interceptGetAISession,
  interceptGetConversations,
  interceptGetPublicProfile,
  interceptGetUnseenCount,
} from '../e2e/intercept/user/messaging.req';
import bootstrap from '../e2e/test/bootstrap';
import {
  buildCurrentUser,
  buildParticipant,
} from '../fixtures/src/messaging/messagingBuilders';

describe('Messagerie - assistant IA dans une nouvelle conversation', () => {
  bootstrap();

  it("le volet de l'assistant s'ouvre avant le premier message", () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({ role: 'Coach' }),
    });
    interceptCurrentUserSubResources();
    interceptGetUnseenCount({ statusCode: 200, body: 0 });
    interceptGetConversations({ statusCode: 200, body: [] });
    interceptGetAISession({ statusCode: 200, body: { messages: [] } });
    interceptGetPublicProfile({
      statusCode: 200,
      body: buildParticipant({
        id: 'user-new',
        firstName: 'Awa',
        lastName: 'Diallo',
        role: 'Candidat',
      }),
    });

    cy.visit('/backoffice/messaging?userId=user-new');
    // Wait for the state to show BEFORE capturing (data loaded, panel open…).
    cy.wait('@getCurrent');
    cy.wait('@getConversations');
    cy.wait('@getPublicProfile');

    cy.get('[data-testid="messaging-ai-assistant-toggle"]').click();
    cy.wait('@getAISession');
    cy.contains('Démarrer la discussion').should('be.visible');

    cy.capture('Assistant IA avant le premier message', {
      caption:
        "Le coach ouvre l'assistant dans une première conversation avec un candidat, avant d'avoir envoyé le moindre message.",
      capture: 'viewport',
    });
  });
});
