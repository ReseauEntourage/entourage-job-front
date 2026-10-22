import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import { interceptCurrentUser } from '../../intercept/user/auth.req';
import {
  interceptGetConversations,
  interceptGetUnseenCount,
} from '../../intercept/user/messaging.req';
import { buildCurrentUser } from '../../../fixtures/src/messaging/messagingBuilders';
import bootstrap from '../bootstrap';

const signInAs = (role: string) => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  window.localStorage.setItem('access-token', 'fake-access-token');
  interceptCurrentUser({ statusCode: 200, body: buildCurrentUser({ role }) });
  interceptCurrentUserSubResources();
  interceptGetUnseenCount({ statusCode: 200, body: 0 });
  interceptGetConversations({ statusCode: 200, body: [] });
  cy.intercept('GET', '/user/profile/recommendations*', {
    statusCode: 200,
    body: {
      embeddingPending: false,
      nextCursor: null,
      recommendations: [],
    },
  }).as('getRecommendations');
};

describe('En tant que - Membre connecté, je vois mon tableau de bord', () => {
  bootstrap();

  ['Candidat', 'Coach'].forEach((role) => {
    it(`Affiche le tableau de bord et ma carte de profil (${role})`, () => {
      signInAs(role);

      cy.visit('/backoffice/dashboard');
      cy.wait('@getCurrent');

      cy.contains('Bienvenue sur votre tableau de bord').should('be.visible');
      cy.get('[data-testid="dashboard-profile-card"]').should('be.visible');
    });
  });

  it('Redirige un visiteur non connecté vers la page de connexion', () => {
    cy.intercept('GET', '/current', { statusCode: 401, body: {} }).as(
      'getCurrentUnauthorized'
    );

    cy.visit('/backoffice/dashboard');

    cy.url().should('include', '/login');
  });
});
