import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import {
  interceptAIStream,
  interceptGetAISession,
  interceptGetConversationById,
  interceptGetConversations,
  interceptGetUnseenCount,
  sseDone,
  sseEvent,
} from '../e2e/intercept/user/messaging.req';
import bootstrap from '../e2e/test/bootstrap';
import {
  buildConversation,
  buildCurrentUser,
  buildMessage,
  buildParticipant,
  CURRENT_USER_ID,
} from '../fixtures/src/messaging/messagingBuilders';

describe('Messagerie - assistant IA proposé au coach', () => {
  bootstrap();

  const login = () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({ role: 'Coach' }),
    });
    interceptCurrentUserSubResources();
    interceptGetUnseenCount({ statusCode: 200, body: 0 });
  };

  const candidate = buildParticipant({
    firstName: 'Awa',
    lastName: 'Diallo',
    role: 'Candidat',
  });

  it('chip "Demander à l\'assistant IA" au premier message du candidat', () => {
    login();
    const conversation = buildConversation({
      id: 'conversation-ai-first-message',
      participants: [
        buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
        candidate,
      ],
      messages: [
        buildMessage({
          author: candidate,
          createdAt: '2026-06-01T10:00:00.000Z',
          content: 'Bonjour, pourriez-vous m’aider à préparer un entretien ?',
        }),
      ],
    });

    interceptGetConversations({ statusCode: 200, body: [conversation] });
    interceptGetConversationById({ statusCode: 200, body: conversation });

    cy.visit('/backoffice/messaging?conversationId=conversation-ai-first-message');
    cy.wait('@getCurrent');
    cy.wait('@getConversationById');
    cy.get('[data-testid="messaging-quick-replies"]').should('be.visible');

    cy.get('[data-testid="messaging-quick-replies"]').capture(
      'Premier message - chip assistant IA',
      {
        caption:
          'Un 4ᵉ chip « ✨ Demander à l’assistant IA » s’ajoute aux 3 suggestions existantes.',
      }
    );
  });

  it('bandeau "Besoin d\'aide pour répondre ?" aux messages suivants, et ouverture de l’assistant', () => {
    login();
    const conversation = buildConversation({
      id: 'conversation-ai-next-message',
      participants: [
        buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
        candidate,
      ],
      messages: [
        buildMessage({
          author: candidate,
          createdAt: '2026-06-01T10:05:00.000Z',
          content: 'Je vous relance, êtes-vous disponible cette semaine ?',
        }),
        buildMessage({
          author: candidate,
          createdAt: '2026-06-01T10:00:00.000Z',
          content: 'Bonjour, pourriez-vous m’aider à préparer un entretien ?',
        }),
      ],
    });

    interceptGetConversations({ statusCode: 200, body: [conversation] });
    interceptGetConversationById({ statusCode: 200, body: conversation });
    interceptGetAISession({ statusCode: 200, body: { messages: [] } });
    interceptAIStream(
      sseEvent({
        content:
          'Bonjour Awa,\nMerci pour votre relance, je suis disponible jeudi et vendredi après-midi. Qu’en pensez-vous ?',
      }) + sseDone
    );

    cy.visit('/backoffice/messaging?conversationId=conversation-ai-next-message');
    cy.wait('@getCurrent');
    cy.wait('@getConversationById');
    cy.get('[data-testid="messaging-ai-assistant-banner"]').should(
      'be.visible'
    );

    cy.get('[data-testid="messaging-ai-assistant-banner"]').capture(
      'Message suivant - bandeau assistant IA',
      {
        caption:
          'Dès qu’un second message du candidat arrive sans réponse du coach, un bandeau propose l’assistant IA (compact sur mobile).',
      }
    );

    cy.get('[data-testid="messaging-ai-assistant-banner"]')
      .contains('button', /^Ouvrir/)
      .click();
    cy.wait('@postAIStream');
    cy.contains('Merci pour votre relance').should('be.visible');

    if (Cypress.expose('device') === 'mobile') {
      cy.get('[data-testid="messaging-message"]')
        .first()
        .should('be.visible');
      cy.capture('Assistant ouvert sur mobile - feuille mi-hauteur', {
        caption:
          'Sur mobile, l’assistant s’ouvre dans une feuille d’environ 60 % de l’écran : le dernier message du candidat reste visible au-dessus, et la réponse est proposée automatiquement.',
        capture: 'viewport',
      });
      return;
    }

    cy.capture('Assistant ouvert sur desktop - réponse proposée automatiquement', {
      caption:
        'L’ouverture depuis le bandeau ou le chip lance aussitôt une proposition de réponse, sans action supplémentaire du coach.',
      capture: 'viewport',
    });
  });
});
