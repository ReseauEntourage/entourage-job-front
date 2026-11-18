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

const openConversation = ({
  conversationId,
  addresseeFirstName,
  addresseeLastName,
}: {
  conversationId: string;
  addresseeFirstName: string;
  addresseeLastName: string;
}) => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  window.localStorage.setItem('access-token', 'fake-access-token');
  interceptCurrentUser({
    statusCode: 200,
    body: buildCurrentUser({ role: 'Coach' }),
  });
  interceptCurrentUserSubResources();
  interceptGetUnseenCount({ statusCode: 200, body: 0 });

  const addressee = buildParticipant({
    firstName: addresseeFirstName,
    lastName: addresseeLastName,
    role: 'Candidat',
  });
  const conversation = buildConversation({
    id: conversationId,
    participants: [
      buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
      addressee,
    ],
    messages: [
      buildMessage({
        author: addressee,
        createdAt: '2024-06-01T10:00:00.000Z',
        content:
          "Bonjour, merci d'avoir accepté mon message. Je cherche un poste d'agent d'accueil.",
      }),
    ],
  });

  interceptGetConversations({ statusCode: 200, body: [conversation] });
  interceptGetConversationById({ statusCode: 200, body: conversation });

  cy.visit(`/backoffice/messaging?conversationId=${conversationId}`);
  // Wait for the state to show BEFORE capturing (data loaded, header rendered).
  cy.wait('@getCurrent');
  cy.wait('@getConversationById');
  cy.get('[data-testid="messaging-message"]').should('have.length', 1);
};

describe('Messagerie - en-tête de conversation sur mobile', () => {
  bootstrap();

  it("coach face à un candidat : l'en-tête tient sur une ligne", () => {
    openConversation({
      conversationId: 'conversation-header',
      addresseeFirstName: 'Yasmine',
      addresseeLastName: 'Benali',
    });
    cy.get('[data-testid="messaging-share-network-toggle"]').should(
      'be.visible'
    );

    cy.capture('En-tête de conversation', {
      caption:
        'Sur mobile, retour, identité, partage, assistant et menu tiennent sur une seule ligne, avec des icônes seules. Sur desktop, les boutons gardent leur libellé.',
      capture: 'viewport',
    });

    cy.get('[data-testid="messaging-share-network-toggle"]').click();
    cy.capture('Choix du réseau de partage', {
      caption: "L'icône de partage ouvre le choix LinkedIn / WhatsApp.",
      capture: 'viewport',
    });
  });

  it("nom très long : l'en-tête reste sur une ligne", () => {
    openConversation({
      conversationId: 'conversation-header-long-name',
      addresseeFirstName: 'Marie-Charlotte',
      addresseeLastName: 'de Montmorency-Laval',
    });
    cy.get('[data-testid="messaging-ai-assistant-toggle"]').should(
      'be.visible'
    );

    cy.capture('Nom très long', {
      caption:
        'Un nom trop long est tronqué par des points de suspension, sans pousser les icônes hors de l’écran.',
      capture: 'viewport',
    });
  });
});
