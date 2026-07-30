import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import { interceptCurrentUser } from '../../intercept/user/auth.req';
import {
  interceptAIStream,
  interceptGetAISession,
  interceptGetConversationById,
  interceptGetConversations,
  interceptGetUnseenCount,
  interceptResetAISession,
  sseEvent,
} from '../../intercept/user/messaging.req';
import bootstrap from '../bootstrap';
import {
  buildConversation,
  buildCurrentUser,
  buildMessage,
  buildParticipant,
  CURRENT_USER_ID,
} from '../../../fixtures/src/messaging/messagingBuilders';

const signInAsCoachWithAIAssistant = (betaEnabled = true) => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  window.localStorage.setItem('access-token', 'fake-access-token');
  interceptCurrentUser({
    statusCode: 200,
    body: buildCurrentUser({
      role: 'Coach',
      betaFeatures: { messaging_ai_assistant: betaEnabled },
    }),
  });
  interceptCurrentUserSubResources();
};

describe('En tant que - Coach, j’utilise l’assistant IA de la messagerie', () => {
  bootstrap();

  let conversation;
  let candidate;

  beforeEach(() => {
    candidate = buildParticipant({
      id: 'user-candidate',
      firstName: 'Sami',
      role: 'Candidat',
    });
    conversation = buildConversation({
      id: 'conversation-ai',
      type: 'direct',
      participants: [
        buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
        candidate,
      ],
      messages: [buildMessage({ author: candidate, content: 'Bonjour' })],
    });

    interceptGetUnseenCount({ statusCode: 200, body: 0 });
    interceptGetConversations({ statusCode: 200, body: [conversation] });
    interceptGetConversationById({ statusCode: 200, body: conversation });
    interceptGetAISession({ statusCode: 200, body: { messages: [] } });
  });

  it("N'affiche pas le bouton assistant si le feature flag beta est désactivé", () => {
    signInAsCoachWithAIAssistant(false);

    cy.visit('/backoffice/messaging?conversationId=conversation-ai');
    cy.wait('@getCurrent');
    cy.wait('@getConversationById');

    cy.get('[data-testid="messaging-ai-assistant-toggle"]').should('not.exist');
  });

  it("N'affiche pas le bouton assistant pour un candidat même avec le flag activé", () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({
        id: 'user-candidate',
        role: 'Candidat',
        betaFeatures: { messaging_ai_assistant: true },
      }),
    });
    interceptCurrentUserSubResources();

    const conversationForCandidate = buildConversation({
      id: 'conversation-ai',
      participants: [
        buildParticipant({ id: 'user-candidate', role: 'Candidat' }),
        buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
      ],
      messages: [buildMessage({ content: 'Bonjour' })],
    });
    interceptGetConversations({
      statusCode: 200,
      body: [conversationForCandidate],
    });
    interceptGetConversationById({
      statusCode: 200,
      body: conversationForCandidate,
    });

    cy.visit('/backoffice/messaging?conversationId=conversation-ai');
    cy.wait('@getCurrent');
    cy.wait('@getConversationById');

    cy.get('[data-testid="messaging-ai-assistant-toggle"]').should('not.exist');
  });

  it('Ouvre le panneau, envoie une question via une suggestion rapide et affiche la réponse streamée', () => {
    signInAsCoachWithAIAssistant(true);
    interceptAIStream(sseEvent({ content: 'Bonjour, voici une suggestion.' }));

    cy.visit('/backoffice/messaging?conversationId=conversation-ai');
    cy.wait('@getCurrent');
    cy.wait('@getConversationById');

    cy.get('[data-testid="messaging-ai-assistant-toggle"]').click();
    cy.wait('@getAISession');

    cy.contains('Proposer une réponse').should('be.visible').click();
    cy.wait('@postAIStream');

    cy.contains('Bonjour, voici une suggestion.').should('be.visible');
  });

  it("Envoie un message manuel via le champ de saisie de l'assistant", () => {
    signInAsCoachWithAIAssistant(true);
    interceptAIStream(sseEvent({ content: 'Réponse à votre question.' }));

    cy.visit('/backoffice/messaging?conversationId=conversation-ai');
    cy.wait('@getCurrent');
    cy.wait('@getConversationById');
    cy.get('[data-testid="messaging-ai-assistant-toggle"]').click();
    cy.wait('@getAISession');

    cy.get('#ai-chat-input').type('Comment relancer ce candidat ?');
    cy.get('[data-testid="messaging-ai-send-button"]').click();
    cy.wait('@postAIStream');

    cy.contains('Réponse à votre question.').should('be.visible');
  });

  it("Affiche la carte d'escalade quand l'assistant signale un besoin d'intervention d'un référent", () => {
    signInAsCoachWithAIAssistant(true);
    interceptAIStream(
      sseEvent({
        type: 'escalate',
        referentUserId: 'referent-1',
        referentName: 'Julie Référente',
      }) + sseEvent({ content: 'Je vous invite à contacter votre référent.' })
    );

    cy.visit('/backoffice/messaging?conversationId=conversation-ai');
    cy.wait('@getCurrent');
    cy.wait('@getConversationById');
    cy.get('[data-testid="messaging-ai-assistant-toggle"]').click();
    cy.wait('@getAISession');

    cy.get('#ai-chat-input').type('Ce candidat semble en détresse.');
    cy.get('[data-testid="messaging-ai-send-button"]').click();
    cy.wait('@postAIStream');

    cy.get('[data-testid="messaging-ai-escalate-card"]')
      .should('be.visible')
      .and('contain.text', 'Julie Référente');
  });

  it("Affiche l'alerte de limite horaire quand le serveur signale un rate limit", () => {
    signInAsCoachWithAIAssistant(true);
    interceptAIStream(sseEvent({ type: 'rate_limit', resetInSeconds: 600 }));

    cy.visit('/backoffice/messaging?conversationId=conversation-ai');
    cy.wait('@getCurrent');
    cy.wait('@getConversationById');
    cy.get('[data-testid="messaging-ai-assistant-toggle"]').click();
    cy.wait('@getAISession');

    cy.get('#ai-chat-input').type('Encore une question ?');
    cy.get('[data-testid="messaging-ai-send-button"]').click();
    cy.wait('@postAIStream');

    cy.get('[data-testid="messaging-ai-rate-limit-alert"]').should(
      'be.visible'
    );
    cy.get('#ai-chat-input').should('be.disabled');
  });

  it('Réinitialise la conversation IA au clic sur le bouton de réinitialisation', () => {
    signInAsCoachWithAIAssistant(true);
    interceptGetAISession({
      statusCode: 200,
      body: {
        messages: [
          { id: 'm1', role: 'assistant', content: 'Historique existant' },
        ],
      },
    });
    interceptResetAISession({ statusCode: 204, body: {} });

    cy.visit('/backoffice/messaging?conversationId=conversation-ai');
    cy.wait('@getCurrent');
    cy.wait('@getConversationById');
    cy.get('[data-testid="messaging-ai-assistant-toggle"]').click();
    cy.wait('@getAISession');

    cy.contains('Historique existant').should('be.visible');
    cy.get('[data-testid="messaging-ai-reset-button"]').click();

    cy.wait('@resetAISession');
    cy.contains('Historique existant').should('not.exist');
  });
});
