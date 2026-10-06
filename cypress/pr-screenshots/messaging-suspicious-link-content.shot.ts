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

describe('Messagerie - contenu des messages et liens', () => {
  bootstrap();

  it('message piégé affiché en texte et mot de bilan avec la modale', () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({ role: 'Coach' }),
    });
    interceptCurrentUserSubResources();
    interceptGetUnseenCount({ statusCode: 200, body: 0 });

    const addressee = buildParticipant({
      firstName: 'Awa',
      lastName: 'Diallo',
      role: 'Candidat',
    });
    const quotedText =
      'Merci pour tout ! Voici mon CV : https://example.com/cv?nom=awa&format=pdf';
    const conversation = buildConversation({
      id: 'conversation-link-content',
      participants: [
        buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
        addressee,
      ],
      messages: [
        buildMessage({
          author: addressee,
          createdAt: '2024-06-01T10:00:00.000Z',
          content:
            'Bonjour, regardez ce lien : http://example.com/"onmouseover="alert(1)\nEt ce texte <b>reste</b> du <script>texte</script>.',
        }),
        buildMessage({
          author: addressee,
          createdAt: '2024-06-01T10:05:00.000Z',
          content:
            "L'offre est ici : https://example.com/offre?ville=paris&contrat=cdi",
        }),
        buildMessage({
          author: addressee,
          createdAt: '2024-06-01T10:10:00.000Z',
          type: 'SERVICE',
          serviceMessageKind: 'CHECKIN_NOTE',
          content: `💬 Awa vous a laissé un mot suite à son bilan de conversation :\n\n« ${quotedText} »`,
          metadata: { authorFirstName: 'Awa', quotedText },
        }),
      ],
    });

    interceptGetConversations({ statusCode: 200, body: [conversation] });
    interceptGetConversationById({ statusCode: 200, body: conversation });

    cy.visit('/backoffice/messaging?conversationId=conversation-link-content');
    // Wait for the state to show BEFORE capturing (data loaded, modal open…).
    cy.wait('@getCurrent');
    cy.wait('@getConversationById');
    cy.get('[data-testid="messaging-message"]').should('have.length', 3);

    cy.capture('Conversation', {
      caption:
        "Le message piégé et le HTML s'affichent en texte ; les liens avec paramètres et le mot de bilan restent cliquables.",
      capture: 'viewport',
    });

    cy.get('[data-message-type="SERVICE"] a').click();
    cy.contains('Vous quittez le réseau Entourage Pro').should('be.visible');
    cy.capture('Modale sur un lien du mot de bilan', {
      caption:
        'Un lien du mot de bilan vers un domaine non vérifié passe par la modale, comme un message normal.',
      capture: 'viewport',
    });
  });
});
