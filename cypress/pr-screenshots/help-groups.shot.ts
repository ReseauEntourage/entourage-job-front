import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import { interceptGetUnseenCount } from '../e2e/intercept/user/messaging.req';
import bootstrap from '../e2e/test/bootstrap';
import {
  buildCurrentUser,
  CURRENT_USER_ID,
} from '../fixtures/src/messaging/messagingBuilders';

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
  isAdmin: roleLabel === 'Équipe Entourage',
  profileLinkable: true,
  ...extra,
});

const deletedAuthor = {
  id: 'deleted-user',
  firstName: null,
  lastNameInitial: null,
  roleLabel: null,
  isDeleted: true,
  isAdmin: false,
  profileLinkable: false,
};

const amina = author('user-amina', 'Amina', 'L.', 'Coach');
// The logged-in candidate: their messages get the author actions
const julien = author(CURRENT_USER_ID, 'Julien', 'P.', 'Candidat', {
  department: 'Paris (75)',
});
const team = author('user-admin', 'Claire', 'M.', 'Équipe Entourage', {
  profileLinkable: false,
});

// 61 members, the most recent first, as the back sorts them
const memberRoles = ['Candidat', 'Coach', 'Prescripteur'];
const memberFirstNames = [
  'Amina',
  'Julien',
  'Sofia',
  'Malik',
  'Nora',
  'Karim',
  'Inès',
  'Thomas',
  'Fatou',
  'Lucas',
];
const members = Array.from({ length: 61 }, (_, index) => ({
  author: author(
    `member-${index}`,
    memberFirstNames[index % memberFirstNames.length],
    `${String.fromCharCode(65 + ((index * 7) % 26))}.`,
    index === 3 ? 'Équipe Entourage' : memberRoles[index % memberRoles.length],
    { profileLinkable: index % 4 !== 3 }
  ),
  hasPicture: false,
  joinedAt: new Date(
    Date.UTC(2026, 9 - Math.floor(index / 16), 5)
  ).toISOString(),
}));

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
  emailsEnabled: true,
  isPublished: true,
  viewerPermissions: {
    state: 'canWrite',
    charterAccepted: false,
  },
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
  viewerReaction: '💪',
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
    editedAt: '2026-09-25T11:00:00.000Z',
    viewerReaction: '👏',
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
    viewerReaction: null,
    author: deletedAuthor,
    reactionsSummary: null,
  },
  {
    id: 'reply-3',
    content:
      'Vous pouvez aussi valoriser ce que vous avez appris pendant cette période (organisation, bénévolat…).',
    createdAt: '2026-09-29T10:00:00.000Z',
    editedAt: null,
    viewerReaction: null,
    author: team,
    reactionsSummary: null,
  },
  {
    id: 'reply-4',
    content: 'Merci à tous, je vais reprendre mon CV avec vos conseils !',
    createdAt: '2026-09-30T16:00:00.000Z',
    editedAt: null,
    viewerReaction: null,
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
  cy.intercept('GET', '/notifications/unseen-count', {
    statusCode: 200,
    body: { count: 0 },
  });
  cy.intercept('GET', '/gamification/achievement-progression', {
    statusCode: 200,
    body: [],
  });
};

const interceptGroupReads = (
  viewerPermissions: Partial<typeof groupPage.viewerPermissions> = {}
) => {
  cy.intercept('GET', '/help-groups', { statusCode: 200, body: groups }).as(
    'getHelpGroups'
  );
  cy.intercept('GET', '/help-groups/refaire-un-cv', {
    statusCode: 200,
    body: {
      ...groupPage,
      viewerPermissions: {
        ...groupPage.viewerPermissions,
        ...viewerPermissions,
      },
    },
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
  // Pages of the members list (search and role filters are not captured)
  cy.intercept('GET', '/help-groups/refaire-un-cv/members*', (req) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    req.reply({
      statusCode: 200,
      body: {
        members: members.slice((page - 1) * limit, page * limit),
        total: members.length,
      },
    });
  }).as('getMembers');
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
        'Introduction et lien vers le cadre, pastilles « À la une » et « Vous êtes membre », invitation à la place de « 0 membre ».',
    });

    cy.visit('/backoffice/groupes/refaire-un-cv');
    cy.wait('@getHelpGroup');
    cy.wait('@getDiscussions');
    cy.wait('@getMembers');
    cy.get('[data-testid="discussion-row"]').should('have.length', 3);
    cy.get('[data-testid="help-group-header"]').should('be.visible');
    cy.get('[data-testid="help-group-members-preview-item"]').should(
      'have.length',
      5
    );
    cy.capture('Page d’un groupe', {
      caption:
        'Membre : en-tête pleine largeur (bouton retour « ‹ Groupes », nom, « Vous êtes membre », nombre de membres cliquable, description, « Quitter le groupe ») ; barre de rédaction et discussions à gauche, sans invitation à se présenter ; « Les membres » (5 arrivées récentes, « Voir les 61 membres »), « Le cadre » et « Emails de ce groupe » à droite. Sur mobile, une seule colonne, « Les membres » sous l’en-tête, « Le cadre » replié et « Quitter le groupe » dans le menu « ⋯ ».',
    });

    cy.get('[data-testid="help-group-members-see-all"]').click();
    cy.get('[data-testid="help-group-member"]').should('have.length', 20);
    cy.contains('20 sur 61 membres').should('be.visible');
    cy.capture('Liste des membres', {
      caption:
        'Modale ouverte par « Voir les 61 membres » ou par le nombre de membres de l’en-tête : recherche par prénom, filtre par rôle, « membre depuis », « Voir le profil » seulement pour une fiche consultable, « 20 sur 61 membres » et « Afficher 20 membres de plus ».',
      capture: 'viewport',
    });

    cy.visit(
      '/backoffice/groupes/refaire-un-cv/discussions/discussion-gap?replyId=reply-3'
    );
    cy.wait('@getDiscussion');
    cy.wait('@getReplies');
    cy.get('[data-highlighted="true"]').should('be.visible');
    cy.get('[data-testid="reply-composer-bar"]').should('exist');
    cy.capture('Discussion', {
      caption:
        'Bouton retour « ‹ Refaire un CV » à la place du fil d’Ariane, titre à 24 px (20 px en mobile), fil intégré à la page, zone de réponse compacte (une ligne, « Répondre » inactif) à la fin des réponses, réaction de la personne signalée, mention « modifié », réponse désignée par ?replyId= mise en évidence.',
    });

    cy.get('[data-testid="reply-composer-bar"]').click();
    cy.get('[data-testid="reply-composer-content"]').type(
      'Merci pour vos conseils !'
    );
    cy.get('[data-testid="reply-composer-cancel"]').should('be.visible');
    cy.get('[data-testid="reply-composer"]').capture('Réponse dépliée', {
      caption:
        'Au focus ou avec un texte : champ de 3 lignes, mention de visibilité, caractères restants, « Annuler » (vide et replie) et « Répondre ».',
    });
  });

  it('groupe sans discussion', () => {
    loginAs('Candidat');
    interceptGroupReads();
    cy.intercept('GET', '/help-groups/refaire-un-cv/discussions*', {
      statusCode: 200,
      body: { items: [], nextCursor: null },
    }).as('getDiscussions');

    cy.visit('/backoffice/groupes/refaire-un-cv');
    cy.wait('@getHelpGroup');
    cy.wait('@getDiscussions');
    cy.get('[data-testid="help-group-no-discussion"]').should('be.visible');
    cy.capture('Groupe sans discussion', {
      caption:
        'Bloc en pointillés « Ce groupe vient d’ouvrir », avec l’invitation à poser la première question.',
    });
  });

  it('participation d’un membre', () => {
    loginAs('Candidat');
    interceptGroupReads();
    cy.intercept(
      'POST',
      '/help-groups/refaire-un-cv/discussions/title-suggestions',
      {
        statusCode: 200,
        body: { title: 'Comment présenter deux ans sans emploi sur mon CV ?' },
      }
    ).as('suggestTitle');

    cy.visit('/backoffice/groupes/refaire-un-cv');
    cy.wait('@getHelpGroup');
    cy.get('[data-testid="discussion-composer-bar"]').click();
    cy.get('[data-testid="discussion-composer-message"]')
      .type(
        'J’ai arrêté de travailler deux ans pour m’occuper de ma famille, comment le présenter ?'
      )
      .blur();
    cy.wait('@suggestTitle');
    cy.contains("Proposé par l'IA. Vérifiez, ajustez sa proposition.").should(
      'be.visible'
    );
    cy.capture('Rédaction d’une discussion', {
      caption:
        'Rédaction en place, ouverte depuis la barre avec l’avatar, message avant le titre, titre proposé par l’IA, « Proposer un autre titre » et « Écrire le mien ». En mobile, mention de visibilité sur sa ligne, puis « Annuler » (bordé) et « Publier » sur toute la largeur.',
    });

    cy.get('[data-testid="discussion-composer-publish"]').click();
    cy.contains('Avant votre première publication').should('be.visible');
    cy.capture('Cadre à la première publication', {
      caption:
        'Cadre commun accepté une seule fois, « Accepter et publier » actif case cochée.',
      capture: 'viewport',
    });
  });

  it('invitations à la place des actions d’écriture', () => {
    loginAs('Candidat');
    interceptGroupReads({ state: 'mustJoin' });

    cy.visit('/backoffice/groupes/refaire-un-cv');
    cy.wait('@getHelpGroup');
    cy.get('[data-testid="write-invitation-join"]').should('be.visible');
    cy.capture('Invitation à rejoindre', {
      caption:
        'Un non-membre lit librement : l’invitation en tête de la colonne principale, « Rejoindre le groupe » dans l’en-tête du groupe.',
    });

    interceptGroupReads({ state: 'mustCompleteElearning' });
    cy.visit('/backoffice/groupes/refaire-un-cv');
    cy.wait('@getHelpGroup');
    cy.get('[data-testid="write-invitation-elearning"]').should('be.visible');
    cy.capture('Page d’un groupe, formation à terminer', {
      caption:
        'E-learning non terminé : invitation vers la page Formations en tête de la colonne principale, aucune action d’adhésion dans l’en-tête.',
    });

    cy.visit('/backoffice/groupes/refaire-un-cv/discussions/discussion-gap');
    cy.wait('@getReplies');
    cy.get('[data-testid="write-invitation-elearning"]').should('be.visible');
    cy.capture('Formation à terminer', {
      caption:
        'E-learning non terminé : invitation vers la page Formations à la place de la zone de réponse et des réactions.',
    });
  });

  it('modération par un admin', () => {
    loginAs('Admin');
    interceptGroupReads({ state: 'mustJoin' });

    cy.visit('/backoffice/groupes/refaire-un-cv/discussions/discussion-gap');
    cy.wait('@getReplies');
    cy.get('[data-testid="discussion-reply"]')
      .first()
      .find('[data-testid="message-menu-toggle"]')
      .click();
    cy.contains('Supprimer ce message').should('be.visible');
    cy.capture('Menu d’un message pour un admin', {
      caption:
        'Copier le lien, versions précédentes d’un message modifié et, séparée par un filet, la suppression de modération.',
      capture: 'viewport',
    });

    cy.contains('Supprimer ce message').click();
    cy.contains('Données personnelles exposées').should('be.visible');
    cy.capture('Suppression de modération', {
      caption:
        'Motif obligatoire, précision facultative, visibles de l’équipe seulement.',
      capture: 'viewport',
    });
  });

  it('signalement et masquage d’un message', () => {
    loginAs('Candidat');
    interceptGroupReads({ state: 'mustJoin' });

    cy.visit('/backoffice/groupes/refaire-un-cv/discussions/discussion-gap');
    cy.wait('@getReplies');
    cy.get('[data-testid="discussion-reply"]')
      .first()
      .find('[data-testid="message-menu-toggle"]')
      .click();
    cy.contains('Signaler ce message').click();
    cy.get('[data-testid="help-group-report-modal"]').should('be.visible');
    cy.contains('label', 'Propos déplacés').click();
    cy.capture('Signalement d’un message', {
      caption:
        'Ouvert à toute personne connectée, membre ou non : motif obligatoire, commentaire facultatif, encart 3114 toujours affiché.',
      capture: 'viewport',
    });

    cy.intercept(
      'GET',
      '/help-groups/refaire-un-cv/discussions/discussion-gap/replies*',
      {
        statusCode: 200,
        body: {
          items: [{ id: 'reply-1', isUnderReview: true }, ...replies.slice(1)],
          nextCursor: null,
        },
      }
    ).as('getReplies');
    cy.visit('/backoffice/groupes/refaire-un-cv/discussions/discussion-gap');
    cy.wait('@getReplies');
    cy.get('[data-testid="hidden-message"]').should('be.visible');
    cy.capture('Message masqué pour un lecteur', {
      caption:
        'Masqué dès le premier signalement : mention neutre, sans auteur, réactions ni actions. Le contenu n’est pas envoyé par l’API.',
    });

    loginAs('Admin');
    cy.intercept(
      'GET',
      '/help-groups/refaire-un-cv/discussions/discussion-gap/replies*',
      {
        statusCode: 200,
        body: {
          items: [
            {
              ...replies[0],
              isUnderReview: true,
              reportReasons: ['INSULTS'],
            },
            ...replies.slice(1),
          ],
          nextCursor: null,
        },
      }
    ).as('getReplies');
    cy.visit('/backoffice/groupes/refaire-un-cv/discussions/discussion-gap');
    cy.wait('@getReplies');
    cy.get('[data-testid="hidden-by-reports-banner"]').should('be.visible');
    cy.capture('Message masqué, vue admin', {
      caption:
        'Bandeau « Masqué après signalements » avec les motifs reçus, « Rétablir » et « Supprimer » (suppression de modération).',
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
        'Onglets Groupes / Supprimés, bascule « À la une » (désactivée sur un groupe non publié), compteurs, « jamais » pour un groupe sans activité, une action principale et un menu « ⋯ ».',
    });

    cy.contains('button', 'Créer un groupe').click();
    cy.get('[data-testid="form-help-group-name"]').type('Trouver un stage');
    cy.capture('Création d’un groupe', {
      caption: 'Modale de création avec compteurs de caractères.',
      capture: 'viewport',
    });
    cy.contains('button', 'Annuler').click();

    cy.get('[data-testid="help-group-menu-group-news"]').click();
    cy.get('[data-testid="help-group-delete-group-news"]').should('be.visible');
    cy.capture('Menu « ⋯ » d’un groupe', {
      caption:
        'Prévisualiser, Modifier, puis « Supprimer le groupe » à part, en orange.',
      capture: 'viewport',
    });
    cy.get('[data-testid="help-group-delete-group-news"]').click();
    cy.get('[data-testid="delete-help-group-name"]').type('Bonnes nouv');
    cy.capture('Suppression d’un groupe', {
      caption:
        'Le bouton reste désactivé tant que le nom saisi n’est pas exactement celui du groupe.',
      capture: 'viewport',
    });
  });
});
