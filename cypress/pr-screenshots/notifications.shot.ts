import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import { interceptGetUnseenCount } from '../e2e/intercept/user/messaging.req';
import bootstrap from '../e2e/test/bootstrap';
import { buildCurrentUser } from '../fixtures/src/messaging/messagingBuilders';

const notifications = [
  {
    id: 'notification-replies',
    type: 'HELP_GROUP_REPLY',
    label: 'Amina et Thomas vous ont répondu',
    excerpt:
      'Tu peux présenter ces deux années comme une période d’aidant : c’est une vraie expérience.',
    context: {
      groupName: 'Refaire un CV',
      discussionTitle: 'Comment présenter une période sans emploi ?',
    },
    lastEventAt: '2026-10-05T09:30:00.000Z',
    seen: false,
    destination: {
      slug: 'refaire-un-cv',
      discussionId: 'discussion-gap',
      replyId: 'reply-amina',
    },
  },
  {
    id: 'notification-participant',
    type: 'HELP_GROUP_REPLY',
    label: 'Sofia a répondu dans une discussion où vous avez participé',
    excerpt: 'Merci pour vos retours, je teste ça cette semaine.',
    context: {
      groupName: 'Préparer ses entretiens',
      discussionTitle: 'Les questions pièges',
    },
    lastEventAt: '2026-10-04T17:00:00.000Z',
    seen: false,
    destination: {
      slug: 'preparer-ses-entretiens',
      discussionId: 'discussion-traps',
      replyId: 'reply-sofia',
    },
  },
  {
    id: 'notification-reaction',
    type: 'HELP_GROUP_REACTION',
    label: 'Malik, Nora, Léa et d’autres soutiennent votre message',
    excerpt: null,
    context: {
      groupName: 'Bonnes nouvelles',
      discussionTitle: 'J’ai décroché un entretien !',
    },
    lastEventAt: '2026-10-02T08:00:00.000Z',
    seen: true,
    destination: {
      slug: 'bonnes-nouvelles',
      discussionId: 'discussion-news',
      replyId: null,
    },
  },
];

const groupPage = {
  id: 'group-cv',
  slug: 'refaire-un-cv',
  name: 'Refaire un CV',
  description:
    'Échanger des conseils pour rédiger, mettre à jour et valoriser son CV, quel que soit son parcours.',
  membersCount: 61,
  isMember: true,
  emailsEnabled: true,
  isPublished: true,
  viewerPermissions: {
    state: 'canWrite',
    charterAccepted: true,
  },
};

const isMobile = () => Cypress.expose('device') === 'mobile';

const login = (items = notifications, unseenCount = 2) => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  window.localStorage.setItem('access-token', 'fake-access-token');
  interceptCurrentUser({
    statusCode: 200,
    body: buildCurrentUser({
      role: 'Candidat',
      firstName: 'Julien',
      lastName: 'Petit',
    }),
  });
  interceptCurrentUserSubResources();
  interceptGetUnseenCount({ statusCode: 200, body: 0 });
  cy.intercept('GET', '/gamification/achievement-progression', {
    statusCode: 200,
    body: [],
  });
  cy.intercept('GET', '/notifications/unseen-count', {
    statusCode: 200,
    body: { count: unseenCount },
  }).as('getUnseenCount');
  cy.intercept('GET', '/notifications*', {
    statusCode: 200,
    body: { items, nextCursor: null },
  }).as('getNotifications');
  cy.intercept('GET', '/help-groups', { statusCode: 200, body: [] });
};

const openBell = () => {
  if (isMobile()) {
    cy.visit('/backoffice/notifications');
  } else {
    cy.get('[data-testid="notifications-bell-button"]').click();
  }
  cy.wait('@getNotifications');
};

describe('Notifications', () => {
  bootstrap();

  it('cloche avec des notifications non vues', () => {
    login();
    cy.visit('/backoffice/dashboard');
    cy.wait('@getCurrent');
    cy.wait('@getUnseenCount');
    cy.get('[data-testid="notifications-badge"]').should('contain', '2');
    cy.get('#nav').capture('Cloche', {
      caption: 'Pastille du nombre de notifications non vues (« 9+ » au-delà).',
    });

    openBell();
    cy.get('[data-testid="notification-item"]').should('have.length', 3);
    cy.capture('Liste des notifications', {
      caption: isMobile()
        ? 'Sur mobile, la cloche ouvre la liste en plein écran.'
        : 'Panneau de la cloche : une ligne par sujet, en prénoms, les non vues signalées.',
      capture: 'viewport',
    });
  });

  it('cloche vide', () => {
    login([], 0);
    cy.visit('/backoffice/dashboard');
    cy.wait('@getCurrent');
    openBell();
    cy.get('[data-testid="notifications-empty"]').should('be.visible');
    cy.capture('Aucune notification', {
      caption: 'Message neutre, sans « 0 » ni absence d’activité.',
      capture: 'viewport',
    });
  });

  it('réglage des emails d’un groupe', () => {
    login();
    cy.intercept('GET', '/help-groups/refaire-un-cv', {
      statusCode: 200,
      body: groupPage,
    }).as('getHelpGroup');
    cy.intercept('GET', '/help-groups/refaire-un-cv/discussions*', {
      statusCode: 200,
      body: { items: [], nextCursor: null },
    });
    cy.visit('/backoffice/groupes/refaire-un-cv?emails=1');
    cy.wait('@getHelpGroup');
    cy.get('[data-testid="emails-setting"]').should('be.visible');
    cy.get('[data-testid="emails-setting"]').capture('Emails de ce groupe', {
      caption:
        'Interrupteur des membres, mis en évidence depuis le lien de réglage des emails.',
    });
  });
});
