import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import {
  interceptGetConversations,
  interceptGetUnseenCount,
} from '../e2e/intercept/user/messaging.req';
import bootstrap from '../e2e/test/bootstrap';
import { buildCurrentUser } from '../fixtures/src/messaging/messagingBuilders';

describe("Tableau de bord d'un admin", () => {
  bootstrap();

  before(() => {
    cy.generateConversationsApiResponse(5);
  });

  const interceptAdmin = () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({
        role: 'Admin',
        firstName: 'Camille',
        lastName: 'Martin',
      }),
    });
    interceptCurrentUserSubResources();
    // The admin has a profile: a presentation and a department, no CV
    cy.intercept('GET', '/current/profile', {
      statusCode: 200,
      body: {
        id: '00000000-0000-0000-0000-000000000001',
        hasPicture: false,
        hasExternalCv: false,
        description: "Je suis l'équipe Entourage Pro.",
        department: 'Paris (75)',
        unavailableAt: null,
        nudges: [],
        sectorOccupations: [],
      },
    }).as('currentProfile');
    cy.intercept('GET', '/user/profile/completion', {
      statusCode: 200,
      body: 60,
    }).as('profileCompletion');
    interceptGetUnseenCount({ statusCode: 200, body: 2 });
  };

  it('admin avec des conversations', () => {
    interceptAdmin();
    interceptGetConversations({ fixture: 'api/generated/conversations' });

    cy.visit('/backoffice/dashboard');
    cy.wait('@getCurrent');
    cy.wait('@getConversations');
    cy.wait('@profileCompletion');
    cy.get('[data-testid="dashboard-profile-card"]').should('be.visible');
    cy.get('[data-testid="dashboard-messaging-widget"]').should('be.visible');
    // The sections of the coach profile card an admin does not get
    cy.get('[data-testid="dashboard-profile-card"]')
      .should('not.contain', 'Mes coups de pouce')
      .and('not.contain', 'Mon CV');

    if (Cypress.expose('device') === 'mobile') {
      cy.capture('Tableau de bord mobile', {
        caption: "Les messages d'abord, puis la carte de profil.",
      });
      cy.get('[data-testid="nav-hamburger"]').click();
      cy.get('#nav').contains('a', 'Accueil').should('be.visible');
      cy.get('#nav').contains('button', 'Ressources').click();
      cy.get('#nav')
        .contains('a', 'Boîte à outils coachs')
        .should('be.visible');
      cy.capture('Menu mobile : Ressources dépliées', {
        caption:
          "Les trois boîtes à outils (avec l'icône de lien externe), puis « Structures de l'inclusion ».",
        capture: 'viewport',
      });
      return;
    }

    cy.get('#nav').contains('Accueil').should('be.visible');
    cy.capture("Tableau de bord de l'admin", {
      caption:
        "La carte de profil à gauche (sans « Mes coups de pouce » ni « Mon CV »), l'aperçu des messages à droite.",
    });
    // The sub menu opens on a CSS :hover, which Cypress cannot trigger: force it
    cy.document().then((doc) => {
      const style = doc.createElement('style');
      style.textContent =
        '.subMenu-container { max-height: 1000px !important; visibility: visible !important; }';
      doc.head.appendChild(style);
    });
    cy.get('#nav')
      .contains('.subMenu-item', 'Boîte à outils coachs')
      .should('be.visible');
    cy.capture('Menu Ressources', {
      caption:
        "« Boîte à outils coachs », « candidats » et « entreprises » portent l'icône de lien externe ; pas de « Formations ».",
      capture: 'viewport',
    });
  });

  it('admin sans aucune conversation', () => {
    interceptAdmin();
    interceptGetConversations({ statusCode: 200, body: [] });

    cy.visit('/backoffice/dashboard');
    cy.wait('@getCurrent');
    cy.wait('@getConversations');
    cy.wait('@profileCompletion');
    cy.get('[data-testid="admin-dashboard-no-messages"]').should('be.visible');
    cy.get('[data-testid="dashboard-profile-card"]').should('be.visible');

    cy.capture('Sans conversation', {
      caption:
        "« Vous n'avez pas encore de messages » et l'accès à la messagerie, à la place de l'aperçu.",
    });
  });
});
