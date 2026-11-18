import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import {
  interceptGetConversationById,
  interceptGetConversations,
  interceptGetUnseenCount,
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

    cy.visit(
      '/backoffice/messaging?conversationId=conversation-ai-first-message'
    );
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

  it('bandeau "Besoin d\'aide pour répondre ?" aux messages suivants', () => {
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

    cy.visit(
      '/backoffice/messaging?conversationId=conversation-ai-next-message'
    );
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
  });

  it('bandeau "Besoin d\'aide pour répondre ?" quand le candidat relance après une réponse du coach', () => {
    login();
    const conversation = buildConversation({
      id: 'conversation-ai-after-coach-reply',
      participants: [
        buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
        candidate,
      ],
      messages: [
        buildMessage({
          author: candidate,
          createdAt: '2026-06-01T10:10:00.000Z',
          content: 'Merci ! Pouvez-vous aussi relire ma lettre de motivation ?',
        }),
        buildMessage({
          author: buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          createdAt: '2026-06-01T10:05:00.000Z',
          content:
            'Bonjour Awa, avec plaisir, quelles sont vos disponibilités ?',
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

    cy.visit(
      '/backoffice/messaging?conversationId=conversation-ai-after-coach-reply'
    );
    cy.wait('@getCurrent');
    cy.wait('@getConversationById');
    cy.get('[data-testid="messaging-ai-assistant-banner"]').should(
      'be.visible'
    );

    cy.get('[data-testid="messaging-ai-assistant-banner"]').capture(
      'Relance après réponse du coach - bandeau assistant IA',
      {
        caption:
          'Le bandeau reste proposé quand le candidat écrit à nouveau après une réponse du coach, tant que celle-ci n’a pas de suite.',
      }
    );
  });

  // L'ouverture de l'assistant lui-même (feuille mi-hauteur mobile / panneau desktop) n'est
  // pas capturée ici : le montage du panneau assistant (MessagingAIPanel/MessagingAIAssistant)
  // fait planter Electron headless dans cet environnement de capture, de façon déterministe
  // et reproduite après redémarrage complet du conteneur — y compris via le bouton pré-existant
  // de l'en-tête, sans lien avec ce change. À vérifier manuellement (voir tasks.md 10.1 et la
  // case « Tests manuels » de la PR).
});
