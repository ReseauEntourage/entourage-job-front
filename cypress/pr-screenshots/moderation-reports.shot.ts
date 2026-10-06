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

const jeanne = {
  id: 'user-jeanne',
  firstName: 'Jeanne',
  lastName: 'Martin',
  role: 'Candidat',
  zone: 'LYON',
};
const paul = {
  id: 'user-paul',
  firstName: 'Paul',
  lastName: 'Durand',
  role: 'Coach',
  zone: 'LYON',
};
const sofia = {
  id: 'user-sofia',
  firstName: 'Sofia',
  lastName: 'Bernard',
  role: 'Coach',
  zone: 'PARIS',
};

const targets = [
  {
    targetType: 'CONVERSATION',
    targetId: 'conversation-reported',
    label: 'Conversation entre Jeanne Martin et Paul Durand',
    zones: ['LYON'],
    pendingCount: 2,
    reportsCount: 2,
    reasons: ['INSULTS', 'SPAM'],
    lastReportedAt: '2026-10-05T14:00:00.000Z',
    status: 'PENDING',
  },
  {
    targetType: 'USER_PROFILE',
    targetId: 'user-paul',
    label: 'Paul Durand',
    zones: ['LYON'],
    pendingCount: 3,
    reportsCount: 3,
    reasons: ['FRAUD'],
    lastReportedAt: '2026-10-04T09:30:00.000Z',
    status: 'PENDING',
  },
  {
    targetType: 'POST_REPLY',
    targetId: 'reply-reported',
    label: 'Refaire un CV — Envoyez-moi vos coordonnées bancaires pour…',
    zones: ['LYON', 'PARIS'],
    pendingCount: 1,
    reportsCount: 1,
    reasons: ['FRAUD'],
    lastReportedAt: '2026-10-03T18:00:00.000Z',
    status: 'PENDING',
  },
];

const report = (props: Record<string, unknown>) => ({
  id: 'report-1',
  reporter: jeanne,
  reason: 'INSULTS',
  comment: 'Il m’a insultée après mon refus.',
  zone: 'LYON',
  status: 'PENDING',
  createdAt: '2026-10-05T14:00:00.000Z',
  resolution: null,
  resolvedAt: null,
  resolvedBy: null,
  resolutionNote: null,
  ...props,
});

const conversationTarget = {
  targetType: 'CONVERSATION',
  targetId: 'conversation-reported',
  label: 'Conversation entre Jeanne Martin et Paul Durand',
  status: 'PENDING',
  canResolve: true,
  reports: [
    report({}),
    report({
      id: 'report-2',
      reporter: null,
      reason: 'SPAM',
      comment: null,
      createdAt: '2026-10-01T10:00:00.000Z',
      status: 'RESOLVED',
      resolution: 'MANUAL',
      resolvedAt: '2026-10-02T09:00:00.000Z',
      resolvedBy: sofia,
      resolutionNote: 'Échange avec la personne, sans suite.',
    }),
  ],
  context: { targetType: 'CONVERSATION', participants: [jeanne, paul] },
};

const conversationMessages = {
  messages: [
    {
      id: 'message-3',
      content: 'Vous ne méritez pas qu’on vous aide.',
      createdAt: '2026-10-05T13:50:00.000Z',
      type: 'USER',
      author: paul,
      medias: [],
    },
    {
      id: 'message-2',
      content: 'Merci, mais je préfère continuer seule pour le moment.',
      createdAt: '2026-10-05T13:40:00.000Z',
      type: 'USER',
      author: jeanne,
      medias: [],
    },
    {
      id: 'message-1',
      content: 'Bonjour Jeanne, je peux relire votre CV si vous voulez.',
      createdAt: '2026-10-05T13:30:00.000Z',
      type: 'USER',
      author: paul,
      medias: [],
    },
  ],
  nextCursor: null,
};

const groupMessageTarget = {
  targetType: 'POST_REPLY',
  targetId: 'reply-reported',
  label: 'Refaire un CV — Envoyez-moi vos coordonnées bancaires pour…',
  status: 'PENDING',
  canResolve: false,
  reports: [report({ reporter: sofia, reason: 'FRAUD', zone: 'PARIS' })],
  context: {
    targetType: 'POST_REPLY',
    group: { id: 'group-cv', name: 'Refaire un CV', slug: 'refaire-un-cv' },
    message: {
      discussionId: 'discussion-gap',
      replyId: 'reply-reported',
      title: null,
      content:
        'Envoyez-moi vos coordonnées bancaires pour que je vous rembourse la relecture.',
      author: paul,
      state: 'HIDDEN',
      createdAt: '2026-10-03T17:00:00.000Z',
    },
  },
};

const loginAs = (role: string) => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  window.localStorage.setItem('access-token', 'fake-access-token');
  interceptCurrentUser({
    statusCode: 200,
    body: buildCurrentUser({
      role,
      zone: 'LYON',
      firstName: role === 'Admin' ? 'Claire' : 'Julien',
      lastName: role === 'Admin' ? 'Martin' : 'Petit',
    }),
  });
  interceptCurrentUserSubResources();
  interceptGetUnseenCount({ statusCode: 200, body: 0 });
  cy.intercept('GET', '/notifications/unseen-count', {
    statusCode: 200,
    body: { count: 0 },
  });
  cy.intercept('GET', '/gamification/achievement-progression', {
    statusCode: 200,
    body: [],
  });
  cy.intercept('GET', '/help-groups', { statusCode: 200, body: [] });
  cy.intercept('GET', /\/admin\/reports\/pending-count/, {
    statusCode: 200,
    body: { count: 2 },
  }).as('getPendingCount');
};

const interceptTargets = () => {
  cy.intercept('GET', /\/admin\/reports\/targets(\?.*)?$/, {
    statusCode: 200,
    body: { items: targets, nextCursor: null },
  }).as('getTargets');
};

describe('Signalements', () => {
  bootstrap();

  it('modale de signalement commune', () => {
    loginAs('Coach');
    const candidate = buildParticipant({
      id: 'user-candidate',
      firstName: 'Awa',
      lastName: 'Diallo',
      role: 'Candidat',
    });
    const conversation = buildConversation({
      id: 'conversation-report',
      participants: [
        buildParticipant({ id: CURRENT_USER_ID, role: 'Coach' }),
        candidate,
      ],
      messages: [
        buildMessage({
          author: candidate,
          createdAt: '2026-10-05T10:00:00.000Z',
          content: 'Bonjour, pouvez-vous m’aider pour mon CV ?',
        }),
      ],
    });
    interceptGetConversations({ statusCode: 200, body: [conversation] });
    interceptGetConversationById({ statusCode: 200, body: conversation });
    cy.intercept('POST', /\/messaging\/conversations\/.*\/report/, {
      statusCode: 409,
      body: { message: 'REPORT_ALREADY_PENDING' },
    }).as('postReport');

    cy.visit('/backoffice/messaging?conversationId=conversation-report');
    cy.wait('@getCurrent');
    cy.wait('@getConversationById');
    cy.get('[data-testid="messaging-conversation-actions-button"]').click();
    cy.get('[data-testid="messaging-report-button"]').click();
    cy.get('[data-testid="messaging-conversation-report-modal"]').should(
      'be.visible'
    );
    cy.get('#report-reason-INSULTS').check({ force: true });
    cy.capture('Signalement d’une conversation', {
      caption:
        'Même modale pour la conversation, le profil et le message de groupe : motif obligatoire, commentaire facultatif, encart 3114.',
      capture: 'viewport',
    });

    cy.get('[data-testid="report-confirm"]').click();
    cy.wait('@postReport');
    cy.get('[data-testid="report-error"]').should('be.visible');
    cy.capture('Signalement déjà à traiter', {
      caption: 'Réponse 409 du back : le contenu a déjà été signalé.',
      capture: 'viewport',
    });
  });

  it('liste des signalements et pastille', () => {
    loginAs('Admin');
    interceptTargets();

    cy.visit('/backoffice/admin/signalements');
    cy.wait('@getCurrent');
    cy.wait('@getTargets');
    cy.get('[data-testid="report-target-list"]').should('be.visible');
    cy.capture('Liste des signalements', {
      caption:
        'Une ligne par contenu signalé ; filtres préréglés sur « À traiter » et la zone de l’admin.',
    });

    if (Cypress.expose('device') === 'mobile') {
      cy.get('[data-testid="nav-hamburger"]').click();
      cy.get('#nav').contains('Les signalements').should('be.visible');
      cy.capture('Menu d’administration', {
        caption:
          'Entrée « Les signalements » après « Les groupes », avec le nombre de contenus à traiter de la zone.',
        capture: 'viewport',
      });
      return;
    }
    // Drawn over the cog without catching clicks: Cypress reads it as covered
    cy.get('[data-testid="nav-administration-badge"]').should('have.text', '2');
    cy.get('[data-testid="nav-administration"]').click();
    cy.contains('.dropdown-item', 'Les signalements').should('be.visible');
    cy.capture('Menu d’administration', {
      caption:
        'Pastille sur la roue dentée et sur l’entrée « Les signalements », placée après « Les groupes ».',
      capture: 'viewport',
    });
  });

  it('fiche d’une conversation signalée', () => {
    loginAs('Admin');
    cy.intercept(
      'GET',
      /\/admin\/reports\/targets\/CONVERSATION\/conversation-reported$/,
      { statusCode: 200, body: conversationTarget }
    ).as('getTarget');
    cy.intercept(
      'GET',
      /\/admin\/reports\/targets\/CONVERSATION\/conversation-reported\/messages/,
      { statusCode: 200, body: conversationMessages }
    ).as('getMessages');

    cy.visit(
      '/backoffice/admin/signalements/CONVERSATION/conversation-reported'
    );
    cy.wait('@getTarget');
    cy.wait('@getMessages');
    cy.get('[data-testid="report-conversation-message"]').should(
      'have.length',
      3
    );
    cy.get('#report-resolve-note').type('Appel à Paul prévu demain.');
    cy.capture('Fiche d’une conversation', {
      caption:
        'Signalements reçus, conversation complète en lecture seule, liens vers les fiches et « Écrire à… », clôture avec note interne.',
    });
  });

  it('fiche d’un message de groupe signalé', () => {
    loginAs('Admin');
    cy.intercept(
      'GET',
      /\/admin\/reports\/targets\/POST_REPLY\/reply-reported$/,
      { statusCode: 200, body: groupMessageTarget }
    ).as('getTarget');

    cy.visit('/backoffice/admin/signalements/POST_REPLY/reply-reported');
    cy.wait('@getTarget');
    cy.get('[data-testid="report-context-group-message"]').should('be.visible');
    cy.capture('Fiche d’un message de groupe', {
      caption:
        'État du message et lien vers le fil ; pas de « Marquer comme traité », le traitement se fait dans le groupe.',
    });
  });
});
