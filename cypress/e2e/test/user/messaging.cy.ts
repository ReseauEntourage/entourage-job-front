import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import { interceptCurrentUser } from '../../intercept/user/auth.req';
import {
  interceptGetConversationById,
  interceptGetConversations,
  interceptGetProfileShareText,
  interceptGetPublicProfile,
  interceptGetUnseenCount,
  interceptPostFeedback,
  interceptPostMessage,
  interceptReportConversation,
  interceptShareProfile,
} from '../../intercept/user/messaging.req';
import bootstrap from '../bootstrap';
import {
  buildConversation,
  buildCurrentUser,
  buildMessage,
  buildParticipant,
  CURRENT_USER_ID,
} from '../../../fixtures/src/messaging/messagingBuilders';

/**
 * Signs in as a given user (role + overrides applied to the /current
 * response) and lands on the messaging page. Mirrors the "already
 * authenticated" pattern from auth.cy.ts (access-token in localStorage +
 * intercept /current + sub-resources) rather than going through the login
 * form, since these tests only care about the messaging page itself.
 */
const signInAs = (userOverrides = {}) => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  window.localStorage.setItem('access-token', 'fake-access-token');
  interceptCurrentUser({
    statusCode: 200,
    body: buildCurrentUser(userOverrides),
  });
  interceptCurrentUserSubResources();
};

describe('En tant que - Membre connecté, je consulte ma messagerie', () => {
  bootstrap();

  beforeEach(() => {
    interceptGetUnseenCount({ statusCode: 200, body: 0 });
  });

  describe('Liste des conversations', () => {
    it("Affiche l'état vide quand je n'ai aucune conversation", () => {
      signInAs({ role: 'Candidat' });
      interceptGetConversations({ statusCode: 200, body: [] });

      cy.visit('/backoffice/messaging');
      cy.wait('@getCurrent');
      cy.wait('@getConversations');

      cy.contains('Aucun message dans votre messagerie').should('be.visible');
    });

    it('Affiche la liste et ouvre une conversation au clic pour afficher ses messages', () => {
      signInAs({ role: 'Coach' });
      const addressee = buildParticipant({
        firstName: 'Fatou',
        lastName: 'Diop',
        role: 'Candidat',
      });
      const currentUserParticipant = buildParticipant({
        id: CURRENT_USER_ID,
        role: 'Coach',
      });
      const conversation = buildConversation({
        participants: [currentUserParticipant, addressee],
        messages: [
          buildMessage({
            content: 'Bonjour, merci pour votre message !',
            author: addressee,
          }),
        ],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });

      cy.visit('/backoffice/messaging');
      cy.wait('@getCurrent');
      cy.wait('@getConversations');

      cy.get('[data-testid="messaging-conversation-item"]')
        .should('have.length', 1)
        .and('contain.text', 'Fatou Diop')
        .click();

      cy.wait('@getConversationById');
      cy.get('[data-testid="messaging-message"]').should(
        'contain.text',
        'Bonjour, merci pour votre message !'
      );
    });

    it('Ouvre directement la conversation ciblée par ?conversationId=', () => {
      signInAs({ role: 'Coach' });
      const addressee = buildParticipant({
        firstName: 'Karim',
        role: 'Candidat',
      });
      const conversation = buildConversation({
        id: 'conversation-42',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          addressee,
        ],
        messages: [buildMessage({ content: 'Salut', author: addressee })],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });

      cy.visit('/backoffice/messaging?conversationId=conversation-42');
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-message"]').should(
        'contain.text',
        'Salut'
      );
    });
  });

  describe('Filtres de la liste (Tous / Non lus)', () => {
    it("L'onglet Non lus ne garde que les conversations avec un message non lu et affiche l'état vide sinon", () => {
      signInAs({ role: 'Coach' });
      const readAddressee = buildParticipant({
        firstName: 'Lu',
        role: 'Candidat',
      });
      const unreadAddressee = buildParticipant({
        firstName: 'NonLu',
        role: 'Candidat',
      });
      const readConversation = buildConversation({
        seenAt: '2024-06-02T00:00:00.000Z',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          readAddressee,
        ],
        messages: [
          buildMessage({
            content: 'Déjà lu',
            author: readAddressee,
            createdAt: '2024-06-01T00:00:00.000Z',
          }),
        ],
      });
      const unreadConversation = buildConversation({
        seenAt: null,
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          unreadAddressee,
        ],
        messages: [
          buildMessage({
            content: 'Pas encore lu',
            author: unreadAddressee,
            createdAt: '2024-06-01T00:00:00.000Z',
          }),
        ],
      });

      interceptGetConversations({
        statusCode: 200,
        body: [readConversation, unreadConversation],
      });

      cy.visit('/backoffice/messaging');
      cy.wait('@getCurrent');
      cy.wait('@getConversations');

      cy.get('[data-testid="messaging-conversation-item"]').should(
        'have.length',
        2
      );

      cy.get('[data-testid="messaging-tab-unread"]').click();
      cy.get('[data-testid="messaging-conversation-item"]')
        .should('have.length', 1)
        .and('contain.text', 'NonLu');

      cy.get('[data-testid="messaging-tab-all"]').click();
      cy.get('[data-testid="messaging-conversation-item"]').should(
        'have.length',
        2
      );
    });

    it('La recherche filtre la liste par nom du participant', () => {
      signInAs({ role: 'Coach' });
      const alice = buildParticipant({ firstName: 'Alice', role: 'Candidat' });
      const bob = buildParticipant({ firstName: 'Bob', role: 'Candidat' });
      const conversations = [
        buildConversation({
          participants: [buildParticipant({ id: CURRENT_USER_ID }), alice],
          messages: [buildMessage({ author: alice })],
        }),
        buildConversation({
          participants: [buildParticipant({ id: CURRENT_USER_ID }), bob],
          messages: [buildMessage({ author: bob })],
        }),
      ];

      interceptGetConversations({ statusCode: 200, body: conversations });

      cy.visit('/backoffice/messaging');
      cy.wait('@getCurrent');
      cy.wait('@getConversations');

      cy.get('[data-testid="messaging-search-bar"] input').type('ali');
      cy.get('[data-testid="messaging-conversation-item"]')
        .should('have.length', 1)
        .and('contain.text', 'Alice');
    });
  });

  describe('Envoi de message', () => {
    it("J'envoie un message texte dans une conversation existante", () => {
      signInAs({ role: 'Coach' });
      const addressee = buildParticipant({
        firstName: 'Nadia',
        role: 'Candidat',
      });
      const conversation = buildConversation({
        id: 'conversation-1',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          addressee,
        ],
        messages: [buildMessage({ author: addressee, content: 'Bonjour' })],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });
      interceptPostMessage({
        statusCode: 201,
        body: buildMessage({
          content: 'Merci, je reviens vers vous rapidement.',
          author: buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          conversationId: 'conversation-1',
        }),
      });

      cy.visit('/backoffice/messaging?conversationId=conversation-1');
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-editor-input"]').type(
        'Merci, je reviens vers vous rapidement.'
      );
      cy.get('[data-testid="messaging-send-button"]').click();

      cy.wait('@postMessage')
        .its('request.body')
        .should('include', 'conversationId');
    });

    it('Le champ de saisie est désactivé quand le destinataire a été supprimé', () => {
      signInAs({ role: 'Coach' });
      const deletedAddressee = buildParticipant({
        firstName: 'Compte',
        lastName: 'Supprimé',
        role: 'Candidat',
        userProfile: null,
      });
      const conversation = buildConversation({
        id: 'conversation-deleted',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          deletedAddressee,
        ],
        messages: [
          buildMessage({
            author: deletedAddressee,
            content: 'Dernier message avant suppression',
          }),
        ],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });

      cy.visit('/backoffice/messaging?conversationId=conversation-deleted');
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-editor-input"]').should('be.disabled');
      cy.get('[data-testid="messaging-send-button"]').should('be.disabled');
    });
  });

  describe('Nouvelle conversation via ?userId=', () => {
    it("Résout une conversation directe déjà existante avec ce participant et l'ouvre", () => {
      signInAs({ role: 'Coach' });
      const addressee = buildParticipant({
        id: 'user-existing',
        firstName: 'Existant',
        role: 'Candidat',
      });
      const conversation = buildConversation({
        id: 'conversation-existing',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          addressee,
        ],
        messages: [
          buildMessage({ author: addressee, content: 'Déjà en contact' }),
        ],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });

      cy.visit('/backoffice/messaging?userId=user-existing');
      cy.wait('@getCurrent');
      cy.wait('@getConversations');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-message"]').should(
        'contain.text',
        'Déjà en contact'
      );
    });

    it('Sans conversation existante, récupère le profil public et prépare une nouvelle conversation avec suggestions de démarrage', () => {
      signInAs({ role: 'Coach' });
      const newAddressee = buildParticipant({
        id: 'user-new',
        firstName: 'Nouveau',
        lastName: 'Contact',
        role: 'Candidat',
      });

      interceptGetConversations({ statusCode: 200, body: [] });
      interceptGetPublicProfile({ statusCode: 200, body: newAddressee });

      cy.visit('/backoffice/messaging?userId=user-new');
      cy.wait('@getCurrent');
      cy.wait('@getConversations');
      cy.wait('@getPublicProfile');

      cy.get('[data-testid="messaging-starter-suggestions"]').should(
        'be.visible'
      );
      cy.get('[data-testid="messaging-suggestion-item"]').first().click();
      cy.get('[data-testid="messaging-editor-input"]').should(
        'not.have.value',
        ''
      );
    });
  });

  describe('Suggestions de démarrage de conversation (candidat)', () => {
    it('Propose des suggestions différentes pour un candidat qui démarre une conversation', () => {
      signInAs({ role: 'Candidat' });
      const coach = buildParticipant({ id: 'user-coach', role: 'Coach' });

      interceptGetConversations({ statusCode: 200, body: [] });
      interceptGetPublicProfile({ statusCode: 200, body: coach });

      cy.visit('/backoffice/messaging?userId=user-coach');
      cy.wait('@getCurrent');
      cy.wait('@getPublicProfile');

      cy.contains('Solliciter le réseau').should('be.visible');
    });
  });

  describe('Réponses rapides (quick replies)', () => {
    it("Propose des réponses rapides au coach qui n'a pas encore répondu à un candidat", () => {
      signInAs({ role: 'Coach' });
      const candidate = buildParticipant({
        id: 'user-candidate',
        role: 'Candidat',
      });
      const conversation = buildConversation({
        id: 'conversation-quick-reply',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          candidate,
        ],
        messages: [
          buildMessage({
            author: candidate,
            content: 'Bonjour, pouvez-vous m’aider ?',
          }),
        ],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });

      cy.visit('/backoffice/messaging?conversationId=conversation-quick-reply');
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-quick-replies"]').should('be.visible');
      cy.get('[data-testid="messaging-quick-replies"]')
        .contains("Proposer de l'aide")
        .click();
      cy.get('[data-testid="messaging-editor-input"]').should(
        'not.have.value',
        ''
      );
    });

    it("Ne propose pas de réponses rapides une fois qu'un brouillon est en cours de rédaction", () => {
      signInAs({ role: 'Coach' });
      const candidate = buildParticipant({
        id: 'user-candidate',
        role: 'Candidat',
      });
      const conversation = buildConversation({
        id: 'conversation-quick-reply-2',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          candidate,
        ],
        messages: [buildMessage({ author: candidate, content: 'Bonjour' })],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });

      cy.visit(
        '/backoffice/messaging?conversationId=conversation-quick-reply-2'
      );
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-quick-replies"]').should('be.visible');
      cy.get('[data-testid="messaging-editor-input"]').type(
        'En cours de frappe'
      );
      cy.get('[data-testid="messaging-quick-replies"]').should('not.exist');
    });
  });

  describe("Bannière 'en attente de réponse'", () => {
    it("S'affiche quand tous les messages de la conversation ont été envoyés par moi", () => {
      signInAs({ role: 'Coach' });
      const candidate = buildParticipant({
        id: 'user-candidate',
        firstName: 'Léa',
        role: 'Candidat',
      });
      const me = buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' });
      const conversation = buildConversation({
        id: 'conversation-waiting',
        type: 'direct',
        participants: [me, candidate],
        messages: [
          buildMessage({ author: me, content: 'Bonjour Léa, je me lance !' }),
        ],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });

      cy.visit('/backoffice/messaging?conversationId=conversation-waiting');
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-waiting-reply-banner"]')
        .should('be.visible')
        .and('contain.text', 'Léa');
    });
  });

  describe('Bannière premier contact', () => {
    it('Propose des conseils pour une toute nouvelle conversation', () => {
      signInAs({ role: 'Candidat' });
      const coach = buildParticipant({ id: 'user-coach', role: 'Coach' });

      interceptGetConversations({ statusCode: 200, body: [] });
      interceptGetPublicProfile({ statusCode: 200, body: coach });

      cy.visit('/backoffice/messaging?userId=user-coach');
      cy.wait('@getCurrent');
      cy.wait('@getPublicProfile');

      cy.get('[data-testid="messaging-first-contact-banner"]').should(
        'be.visible'
      );
      cy.contains('Voir les conseils').click();
      cy.contains('Comment structurer votre premier échange').should(
        'be.visible'
      );
    });
  });

  describe('Avis sur la conversation (feedback)', () => {
    it('Cliquer sur une étoile envoie la note et affiche une notification de remerciement', () => {
      signInAs({ role: 'Candidat' });
      const coach = buildParticipant({
        id: 'user-coach',
        firstName: 'Marc',
        role: 'Coach',
      });
      const conversation = buildConversation({
        id: 'conversation-feedback',
        shouldGiveFeedback: true,
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Candidat' }),
          coach,
        ],
        messages: [buildMessage({ author: coach, content: 'Bon courage !' })],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });
      interceptPostFeedback({ statusCode: 201, body: {} });

      cy.visit('/backoffice/messaging?conversationId=conversation-feedback');
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-feedback-alert"]').should('be.visible');
      cy.get('[data-testid="star-rating-4"]').click();

      cy.wait('@postFeedback')
        .its('request.body')
        .should('deep.include', { rating: 4 });
      cy.contains('Merci pour votre retour').should('be.visible');
      cy.get('[data-testid="messaging-feedback-alert"]').should('not.exist');
    });

    it("Fermer l'alerte envoie une note nulle sans afficher de confirmation", () => {
      signInAs({ role: 'Candidat' });
      const coach = buildParticipant({ id: 'user-coach', role: 'Coach' });
      const conversation = buildConversation({
        id: 'conversation-feedback-close',
        shouldGiveFeedback: true,
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Candidat' }),
          coach,
        ],
        messages: [buildMessage({ author: coach })],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });
      interceptPostFeedback({ statusCode: 201, body: {} });

      cy.visit(
        '/backoffice/messaging?conversationId=conversation-feedback-close'
      );
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-feedback-alert"] button').first().click({
        force: true,
      });

      cy.wait('@postFeedback')
        .its('request.body')
        .should('deep.include', { rating: null });
      cy.contains('Merci pour votre retour').should('not.exist');
    });
  });

  describe('Signalement (report abuse)', () => {
    it("Depuis l'en-tête, je signale la conversation avec une raison et un commentaire", () => {
      signInAs({ role: 'Coach' });
      const candidate = buildParticipant({
        id: 'user-candidate',
        role: 'Candidat',
      });
      const conversation = buildConversation({
        id: 'conversation-report',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          candidate,
        ],
        messages: [buildMessage({ author: candidate })],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });
      interceptReportConversation({ statusCode: 201, body: {} });

      cy.visit('/backoffice/messaging?conversationId=conversation-report');
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-report-button"]').click();
      cy.contains('Signaler une conversation').should('be.visible');

      cy.get('[data-testid="form-report-user-reason"]').click();
      cy.get('#select-option-SPAM').click();
      cy.get('#form-report-user-comment').type('Sollicitation commerciale');
      cy.get('[data-testid="form-confirm-form-report-user"]').click();

      cy.wait('@postReportConversation')
        .its('request.body')
        .should('deep.include', {
          reason: 'SPAM',
          comment: 'Sollicitation commerciale',
        });
    });
  });

  describe('Limite quotidienne de nouvelles conversations', () => {
    it("Affiche une notification d'erreur quand le serveur refuse une nouvelle conversation (429)", () => {
      signInAs({ role: 'Coach' });
      const newContact = buildParticipant({
        id: 'user-too-many',
        role: 'Candidat',
      });

      interceptGetConversations({ statusCode: 200, body: [] });
      interceptGetPublicProfile({ statusCode: 200, body: newContact });
      interceptPostMessage({
        statusCode: 429,
        body: { message: 'DAILY_CONVERSATION_LIMIT_REACHED' },
      });

      cy.visit('/backoffice/messaging?userId=user-too-many');
      cy.wait('@getCurrent');
      cy.wait('@getPublicProfile');

      cy.get('[data-testid="messaging-editor-input"]').type('Bonjour !');
      cy.get('[data-testid="messaging-send-button"]').click();

      cy.wait('@postMessage');
      cy.contains('vous avez déjà contacté le maximum de membres').should(
        'be.visible'
      );
    });
  });

  describe('Partage du profil sur le réseau', () => {
    it('Propose le partage LinkedIn/WhatsApp au coach qui échange avec un candidat', () => {
      signInAs({ role: 'Coach' });
      const candidate = buildParticipant({
        id: 'user-candidate',
        firstName: 'Yasmine',
        role: 'Candidat',
      });
      const conversation = buildConversation({
        id: 'conversation-share',
        type: 'direct',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          candidate,
        ],
        messages: [buildMessage({ author: candidate })],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });

      cy.visit('/backoffice/messaging?conversationId=conversation-share');
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-share-network-toggle"]').should(
        'be.visible'
      );
    });

    it('Ne propose pas le partage réseau à un candidat', () => {
      signInAs({ role: 'Candidat' });
      const coach = buildParticipant({ id: 'user-coach', role: 'Coach' });
      const conversation = buildConversation({
        id: 'conversation-share-candidate',
        type: 'direct',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Candidat' }),
          coach,
        ],
        messages: [buildMessage({ author: coach })],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });

      cy.visit(
        '/backoffice/messaging?conversationId=conversation-share-candidate'
      );
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-share-network-toggle"]').should(
        'not.exist'
      );
    });

    it('Le partage WhatsApp récupère le texte de partage puis enregistre le partage', () => {
      signInAs({ role: 'Coach' });
      const candidate = buildParticipant({
        id: 'user-candidate',
        firstName: 'Yasmine',
        role: 'Candidat',
      });
      const conversation = buildConversation({
        id: 'conversation-share-whatsapp',
        type: 'direct',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          candidate,
        ],
        messages: [buildMessage({ author: candidate })],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });
      interceptGetProfileShareText({
        statusCode: 200,
        body: { text: 'Découvrez le profil de Yasmine !' },
      });
      interceptShareProfile({ statusCode: 201, body: { success: true } });

      cy.visit(
        '/backoffice/messaging?conversationId=conversation-share-whatsapp'
      );
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.window().then((win) => cy.stub(win, 'open').as('windowOpen'));

      cy.get('[data-testid="messaging-share-network-toggle"]').click();
      cy.contains('Partager sur WhatsApp').click();

      cy.wait('@getProfileShareText');
      cy.wait('@postShareProfile')
        .its('request.body')
        .should('deep.include', { channel: 'whatsapp' });
      cy.get('@windowOpen').should(
        'have.been.calledWithMatch',
        'https://wa.me/'
      );
    });

    it('Le partage LinkedIn ouvre la fenêtre de prévisualisation du post', () => {
      signInAs({ role: 'Coach' });
      const candidate = buildParticipant({
        id: 'user-candidate',
        firstName: 'Yasmine',
        role: 'Candidat',
      });
      const conversation = buildConversation({
        id: 'conversation-share-linkedin',
        type: 'direct',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
          candidate,
        ],
        messages: [buildMessage({ author: candidate })],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });
      interceptGetProfileShareText({
        statusCode: 200,
        body: { text: 'Découvrez le profil de Yasmine !' },
      });

      cy.visit(
        '/backoffice/messaging?conversationId=conversation-share-linkedin'
      );
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.get('[data-testid="messaging-share-network-toggle"]').click();
      cy.contains('Partager sur LinkedIn').click();

      cy.contains('Partager le profil de Yasmine sur LinkedIn').should(
        'be.visible'
      );
    });
  });

  describe('Contenu suspect', () => {
    it('Affiche un avertissement sur un message reçu contenant une expression suspecte et permet de le signaler', () => {
      // isSuspiciousMessage() matches against the NEXT_PUBLIC_MESSAGING_FORBIDDEN_EXPRESSIONS
      // env var, which is baked in at build time (Next.js public env var) —
      // Cypress.env() can't see or override it at runtime. "rib" is part of
      // the list committed in .env; if that list changes, update this string.
      // The feature is entirely dark if the env var is ever emptied (see .env.dist).
      signInAs({ role: 'Candidat' });
      const coach = buildParticipant({ id: 'user-coach', role: 'Coach' });
      const conversation = buildConversation({
        id: 'conversation-suspicious',
        participants: [
          buildParticipant({ id: CURRENT_USER_ID, role: 'Candidat' }),
          coach,
        ],
        messages: [
          buildMessage({
            author: coach,
            content: 'Envoyez-moi votre rib pour vous aider plus vite',
          }),
        ],
      });

      interceptGetConversations({ statusCode: 200, body: [conversation] });
      interceptGetConversationById({ statusCode: 200, body: conversation });
      interceptReportConversation({ statusCode: 201, body: {} });

      cy.visit('/backoffice/messaging?conversationId=conversation-suspicious');
      cy.wait('@getCurrent');
      cy.wait('@getConversationById');

      cy.contains('peut-être malveillant').should('be.visible');
      cy.contains('signaler ce message').click();
      cy.get('#form-report-user-comment').should('contain.value', 'suspicieux');
    });
  });
});
