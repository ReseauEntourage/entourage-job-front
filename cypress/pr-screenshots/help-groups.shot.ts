import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import { interceptGetUnseenCount } from '../e2e/intercept/user/messaging.req';
import bootstrap from '../e2e/test/bootstrap';
import { buildCurrentUser } from '../fixtures/src/messaging/messagingBuilders';

const author = (
  id: string,
  firstName: string,
  lastNameInitial: string,
  roleLabel: string,
  extra: Record<string, unknown> = {}
) => ({
  id,
  firstName,
  lastNameInitial,
  roleLabel,
  isDeleted: false,
  profileLinkable: true,
  ...extra,
});

const deletedAuthor = {
  id: 'deleted-user',
  firstName: null,
  lastNameInitial: null,
  roleLabel: null,
  isDeleted: true,
  profileLinkable: false,
};

const amina = author('user-amina', 'Amina', 'L.', 'Coach');
const julien = author('user-julien', 'Julien', 'P.', 'Candidat', {
  department: 'Paris (75)',
});
const team = author('user-admin', 'Claire', 'M.', 'Équipe Entourage', {
  profileLinkable: false,
});

const groups = [
  {
    id: 'group-cv',
    slug: 'refaire-un-cv',
    name: 'Refaire un CV',
    description:
      'Échanger des conseils pour rédiger, mettre à jour et valoriser son CV, quel que soit son parcours.',
    membersCount: 61,
    isMember: true,
    recentContributors: [
      { id: 'user-amina', initials: 'AL', hasPicture: false },
      { id: 'user-julien', initials: 'JP', hasPicture: false },
      { id: 'user-sofia', initials: 'SB', hasPicture: false },
    ],
    pinnedAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'group-news',
    slug: 'bonnes-nouvelles',
    name: 'Bonnes nouvelles',
    description:
      'Un nouveau poste, un premier entretien, une formation validée : partagez vos réussites avec le réseau.',
    membersCount: 128,
    isMember: false,
    recentContributors: [
      { id: 'user-malik', initials: 'MD', hasPicture: false },
    ],
    pinnedAt: null,
  },
  {
    id: 'group-interviews',
    slug: 'preparer-ses-entretiens',
    name: 'Préparer ses entretiens',
    description:
      'Simulations, questions pièges et retours d’expérience pour aborder ses entretiens sereinement.',
    membersCount: 0,
    isMember: false,
    recentContributors: [],
    pinnedAt: null,
  },
];

const groupPage = {
  id: 'group-cv',
  slug: 'refaire-un-cv',
  name: 'Refaire un CV',
  description:
    'Échanger des conseils pour rédiger, mettre à jour et valoriser son CV, quel que soit son parcours.\nLes coachs du réseau y partagent aussi leurs relectures.',
  membersCount: 61,
  isMember: true,
  isPublished: true,
};

const discussions = [
  {
    id: 'discussion-gap',
    title: 'Comment présenter une période sans emploi dans son CV ?',
    createdAt: '2026-09-25T09:00:00.000Z',
    lastActivityAt: '2026-09-30T16:00:00.000Z',
    author: julien,
    repliesCount: 4,
    reactionsSummary: {
      emojis: ['💪', '❤️'],
      firstNames: ['Amina', 'Sofia'],
      hasOthers: false,
    },
  },
  {
    id: 'discussion-photo',
    title: 'Faut-il encore mettre une photo sur son CV ?',
    createdAt: '2026-09-28T11:00:00.000Z',
    lastActivityAt: '2026-09-28T11:00:00.000Z',
    author: amina,
    repliesCount: 0,
    reactionsSummary: null,
  },
  {
    id: 'discussion-template',
    title: 'Un modèle de CV simple à partager',
    createdAt: '2026-09-15T08:00:00.000Z',
    lastActivityAt: '2026-09-22T08:00:00.000Z',
    author: deletedAuthor,
    repliesCount: 1,
    reactionsSummary: {
      emojis: ['👏', '🙌', '🎉'],
      firstNames: ['Malik', 'Nora', 'Julien'],
      hasOthers: true,
    },
  },
];

const discussion = {
  ...discussions[0],
  content:
    'Bonjour à tous,\nJ’ai arrêté de travailler pendant deux ans pour m’occuper de ma famille. Comment le présenter sans que ce soit un frein ?\nJ’ai trouvé ce guide, mais je ne sais pas s’il est à jour : https://www.example.com/guide-cv',
  editedAt: null,
  group: {
    id: 'group-cv',
    slug: 'refaire-un-cv',
    name: 'Refaire un CV',
    isPublished: true,
  },
};

const replies = [
  {
    id: 'reply-1',
    content:
      'Bonjour Julien, une ligne « Projet familial » avec les dates suffit, sans se justifier davantage.',
    createdAt: '2026-09-25T10:00:00.000Z',
    editedAt: null,
    author: amina,
    reactionsSummary: {
      emojis: ['👏'],
      firstNames: ['Julien'],
      hasOthers: false,
    },
  },
  {
    id: 'reply-2',
    content: 'Pareil pour moi, et ça n’a jamais posé de problème en entretien.',
    createdAt: '2026-09-26T10:00:00.000Z',
    editedAt: null,
    author: deletedAuthor,
    reactionsSummary: null,
  },
  {
    id: 'reply-3',
    content:
      'Vous pouvez aussi valoriser ce que vous avez appris pendant cette période (organisation, bénévolat…).',
    createdAt: '2026-09-29T10:00:00.000Z',
    editedAt: null,
    author: team,
    reactionsSummary: null,
  },
  {
    id: 'reply-4',
    content: 'Merci à tous, je vais reprendre mon CV avec vos conseils !',
    createdAt: '2026-09-30T16:00:00.000Z',
    editedAt: null,
    author: julien,
    reactionsSummary: null,
  },
];

const adminGroups = [
  {
    ...groups[0],
    publishedAt: '2026-09-01T10:00:00.000Z',
    createdAt: '2026-08-30T10:00:00.000Z',
    deletedAt: null,
    discussionsCount: 12,
    lastActivityAt: '2026-09-30T16:00:00.000Z',
  },
  {
    ...groups[1],
    publishedAt: '2026-09-05T10:00:00.000Z',
    createdAt: '2026-09-04T10:00:00.000Z',
    deletedAt: null,
    discussionsCount: 5,
    lastActivityAt: '2026-09-29T08:00:00.000Z',
  },
  {
    ...groups[2],
    publishedAt: null,
    pinnedAt: null,
    createdAt: '2026-09-28T10:00:00.000Z',
    deletedAt: null,
    discussionsCount: 0,
    lastActivityAt: null,
  },
];

const loginAs = (role: string) => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  window.localStorage.setItem('access-token', 'fake-access-token');
  interceptCurrentUser({
    statusCode: 200,
    body: buildCurrentUser({
      role,
      firstName: role === 'Admin' ? 'Claire' : 'Julien',
      lastName: role === 'Admin' ? 'Martin' : 'Petit',
    }),
  });
  interceptCurrentUserSubResources();
  interceptGetUnseenCount({ statusCode: 200, body: 0 });
  cy.intercept('GET', '/gamification/achievement-progression', {
    statusCode: 200,
    body: [],
  });
};

const interceptGroupReads = () => {
  cy.intercept('GET', '/help-groups', { statusCode: 200, body: groups }).as(
    'getHelpGroups'
  );
  cy.intercept('GET', '/help-groups/refaire-un-cv', {
    statusCode: 200,
    body: groupPage,
  }).as('getHelpGroup');
  cy.intercept('GET', '/help-groups/refaire-un-cv/discussions*', {
    statusCode: 200,
    body: { items: discussions, nextCursor: null },
  }).as('getDiscussions');
  cy.intercept('GET', '/help-groups/refaire-un-cv/discussions/discussion-gap', {
    statusCode: 200,
    body: discussion,
  }).as('getDiscussion');
  cy.intercept(
    'GET',
    '/help-groups/refaire-un-cv/discussions/discussion-gap/replies*',
    { statusCode: 200, body: { items: replies, nextCursor: null } }
  ).as('getReplies');
};

// On desktop the header is captured alone; on mobile the hamburger menu is
// opened first, since the entries only show up there.
const captureMenu = (
  title: string,
  caption: string,
  openDesktopMenu?: () => void
) => {
  if (Cypress.expose('device') === 'mobile') {
    cy.get('[data-testid="nav-hamburger"]').click();
    cy.get('#nav').contains('a', 'Mon profil').should('be.visible');
    cy.capture(title, { caption, capture: 'viewport' });
    return;
  }
  if (openDesktopMenu) {
    openDesktopMenu();
    cy.capture(title, { caption, capture: 'viewport' });
    return;
  }
  cy.get('#nav').capture(title, { caption });
};

describe('Groupes', () => {
  bootstrap();

  it('lecture des groupes par un candidat', () => {
    loginAs('Candidat');
    interceptGroupReads();

    cy.visit('/backoffice/groupes');
    cy.wait('@getCurrent');
    cy.wait('@getHelpGroups');
    cy.get('[data-testid="help-group-card"]').should('have.length', 3);
    cy.capture('Liste des groupes', {
      caption:
        'Groupe épinglé en tête, mention « Vous êtes membre », invitation à la place de « 0 membre ».',
    });

    cy.visit('/backoffice/groupes/refaire-un-cv');
    cy.wait('@getHelpGroup');
    cy.wait('@getDiscussions');
    cy.get('[data-testid="discussion-row"]').should('have.length', 3);
    cy.capture('Page d’un groupe', {
      caption:
        'Fil d’Ariane, en-tête, cadre commun à tous les groupes et discussions, en lecture seule.',
    });

    cy.visit(
      '/backoffice/groupes/refaire-un-cv/discussions/discussion-gap?replyId=reply-3'
    );
    cy.wait('@getDiscussion');
    cy.wait('@getReplies');
    cy.get('[data-highlighted="true"]').should('be.visible');
    cy.capture('Discussion', {
      caption:
        'Réponses chronologiques, compte supprimé, réactions en prénoms, carte de l’auteur et réponse désignée par ?replyId= mise en évidence.',
    });
  });

  it('menu d’un candidat', () => {
    loginAs('Candidat');
    interceptGroupReads();

    cy.visit('/backoffice/groupes/refaire-un-cv');
    cy.wait('@getCurrent');
    cy.wait('@getHelpGroups');
    cy.wait('@getHelpGroup');
    // The entry is rendered once the published groups are loaded
    cy.get('#nav').contains('a', 'Groupes').should('exist');
    captureMenu(
      'Menu d’un candidat',
      'Entrée « Groupes » juste après « Réseau d’entraide », active sur la page d’un groupe. Elle n’apparaît qu’à partir d’un groupe publié.'
    );
  });

  it('menu d’administration', () => {
    loginAs('Admin');
    interceptGroupReads();
    cy.intercept('GET', '/admin/help-groups*', {
      statusCode: 200,
      body: adminGroups,
    }).as('getAdminHelpGroups');

    cy.visit('/backoffice/admin/groupes');
    cy.wait('@getCurrent');
    cy.wait('@getAdminHelpGroups');
    cy.get('[data-testid="help-group-admin-list"]').should('be.visible');
    captureMenu(
      'Menu d’administration',
      'Pages d’administration regroupées dans un menu à part, ouvert par la roue dentée : Les candidats, Les coachs, Les prescripteurs, Les structures partenaires, Les groupes.',
      () => {
        cy.get('[data-testid="nav-administration"]').click();
        cy.contains('.dropdown-item', 'Les groupes').should('be.visible');
      }
    );
  });

  it('administration des groupes', () => {
    loginAs('Admin');
    cy.intercept('GET', '/admin/help-groups*', {
      statusCode: 200,
      body: adminGroups,
    }).as('getAdminHelpGroups');

    cy.visit('/backoffice/admin/groupes');
    cy.wait('@getCurrent');
    cy.wait('@getAdminHelpGroups');
    cy.get('[data-testid="help-group-admin-list"]').should('be.visible');
    cy.capture('Administration des groupes', {
      caption:
        'États, épinglage, compteurs, « jamais » pour un groupe sans activité, actions selon l’état.',
    });

    cy.contains('button', 'Créer un groupe').click();
    cy.get('[data-testid="form-help-group-name"]').type('Trouver un stage');
    cy.capture('Création d’un groupe', {
      caption: 'Modale de création avec compteurs de caractères.',
      capture: 'viewport',
    });
    cy.contains('button', 'Annuler').click();

    cy.get('[data-testid="help-group-delete-group-news"]').click();
    cy.get('[data-testid="delete-help-group-name"]').type('Bonnes nouv');
    cy.capture('Suppression d’un groupe', {
      caption:
        'Le bouton reste désactivé tant que le nom saisi n’est pas exactement celui du groupe.',
      capture: 'viewport',
    });
  });
});
