import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import { interceptCurrentUser } from '../../intercept/user/auth.req';
import {
  interceptGetConversations,
  interceptGetUnseenCount,
} from '../../intercept/user/messaging.req';
import bootstrap from '../bootstrap';
import { buildCurrentUser } from '../../../fixtures/src/messaging/messagingBuilders';

const signInAs = (userOverrides = {}) => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  window.localStorage.setItem('access-token', 'fake-access-token');
  interceptCurrentUser({
    statusCode: 200,
    body: buildCurrentUser(userOverrides),
  });
  interceptCurrentUserSubResources();
};

describe('En tant que - Membre connecté, je vois le widget messagerie du tableau de bord', () => {
  bootstrap();

  before(() => {
    cy.generateConversationsApiResponse(5);
  });

  beforeEach(() => {
    interceptGetUnseenCount({ statusCode: 200, body: 0 });
  });

  it("N'affiche pas le widget quand je n'ai aucune conversation", () => {
    signInAs({ role: 'Coach' });
    interceptGetConversations({ statusCode: 200, body: [] });

    cy.visit('/backoffice/dashboard');
    cy.wait('@getCurrent');
    cy.wait('@getConversations');

    cy.contains('Mes derniers messages').should('not.exist');
  });

  it('Affiche au maximum les 3 conversations les plus récentes', () => {
    signInAs({ role: 'Coach' });
    interceptGetConversations({ fixture: 'api/generated/conversations' });

    cy.visit('/backoffice/dashboard');
    cy.wait('@getCurrent');
    cy.wait('@getConversations');

    cy.get('[data-testid="dashboard-messaging-widget"]').should('be.visible');
    cy.get('[data-testid="dashboard-messaging-widget-item"]').should(
      'have.length',
      3
    );
  });

  it("Clic sur une conversation du widget m'emmène sur la messagerie avec le bon destinataire", () => {
    signInAs({ role: 'Coach' });
    interceptGetConversations({ fixture: 'api/generated/conversations' });

    cy.visit('/backoffice/dashboard');
    cy.wait('@getCurrent');
    cy.wait('@getConversations');

    cy.get('[data-testid="dashboard-messaging-widget-item"]').first().click();
    cy.url().should('include', '/backoffice/messaging?userId=');
  });

  it("Le bouton 'Accéder à la messagerie' redirige vers la messagerie", () => {
    signInAs({ role: 'Coach' });
    interceptGetConversations({ fixture: 'api/generated/conversations' });

    cy.visit('/backoffice/dashboard');
    cy.wait('@getCurrent');
    cy.wait('@getConversations');

    cy.contains('Accéder à la messagerie').click();
    cy.url().should('include', '/backoffice/messaging');
  });
});
