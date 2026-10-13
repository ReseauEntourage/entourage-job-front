import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import {
  interceptGetConversations,
  interceptGetUnseenCount,
} from '../e2e/intercept/user/messaging.req';
import bootstrap from '../e2e/test/bootstrap';
import { buildCurrentUser } from '../fixtures/src/messaging/messagingBuilders';

describe('En-tête connecté', () => {
  bootstrap();

  before(() => {
    cy.generateConversationsApiResponse(5);
  });

  it('menu de la photo : fermé puis ouvert', () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({ role: 'Coach' }),
    });
    interceptCurrentUserSubResources();
    interceptGetUnseenCount({ statusCode: 200, body: 2 });
    interceptGetConversations({ fixture: 'api/generated/conversations' });
    cy.fixture('public-profile-res').then((profile) => {
      cy.intercept('GET', '/user/profile/recommendations*', {
        statusCode: 200,
        body: {
          embeddingPending: false,
          nextCursor: null,
          recommendations: [1, 2, 3].map((index) => ({
            id: `reco-${index}`,
            publicProfile: {
              ...profile,
              id: `${profile.id}-${index}`,
              role: 'Candidate',
            },
            reason: null,
          })),
        },
      }).as('getRecommendations');
    });

    cy.visit('/backoffice/dashboard');
    cy.wait('@getCurrent');
    cy.wait('@getConversations');
    cy.wait('@getRecommendations');
    cy.get('#nav').should('be.visible');

    // On mobile the entries live in the side panel, opened by the hamburger
    if (Cypress.expose('device') === 'mobile') {
      cy.get('[data-testid="nav-hamburger"]').click();
      cy.get('#nav').contains('a', 'Accueil').should('be.visible');
      cy.get('#nav').contains('a', 'Mon profil').should('be.visible');
      cy.capture('Panneau mobile', {
        caption:
          '« Accueil » remplace « Tableau de bord » ; « Mon profil » et « Se déconnecter » restent dans le panneau.',
        capture: 'viewport',
      });
      return;
    }

    cy.get('#nav').contains('Accueil').should('be.visible');
    cy.get('#nav').should('not.contain', 'Bonjour');
    cy.get('#nav').capture('Menu fermé', {
      caption:
        'La barre sans « Mon profil » : la photo et sa flèche remplacent « Bonjour Prénom ».',
    });

    cy.get('#nav-profile').click();
    cy.get('[role="menu"]').should('be.visible');
    cy.get('[role="menu"]').contains('Mon profil').should('be.visible');
    cy.get('[role="menu"]').contains('Se déconnecter').should('be.visible');
    cy.capture('Menu ouvert', {
      caption: '« Mon profil » puis « Se déconnecter » en darkOrange.',
      capture: 'viewport',
    });
  });
});
