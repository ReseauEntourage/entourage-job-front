import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import {
  interceptGetConversations,
  interceptGetUnseenCount,
} from '../e2e/intercept/user/messaging.req';
import bootstrap from '../e2e/test/bootstrap';
import { buildCurrentUser } from '../fixtures/src/messaging/messagingBuilders';

describe('Tableau de bord : groupe WhatsApp', () => {
  bootstrap();

  before(() => {
    cy.generateConversationsApiResponse(5);
  });

  it('modale pour rejoindre le groupe WhatsApp', () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', 'fake-access-token');
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({ role: 'Coach' }),
    });
    interceptCurrentUserSubResources();
    interceptGetUnseenCount({ statusCode: 200, body: 0 });
    interceptGetConversations({ fixture: 'api/generated/conversations' });
    cy.intercept('GET', '/current/profile/recommendations*', {
      statusCode: 200,
      body: {
        embeddingPending: false,
        nextCursor: null,
        recommendations: [],
      },
    }).as('getRecommendations');

    // The modal loads its zone, then waits 500 ms before showing it: mock it, and wait for it.
    cy.intercept('GET', '/current/whatsapp-zone', {
      statusCode: 200,
      body: {
        name: 'Coachs de Paris',
        url: 'https://chat.whatsapp.com/fixture',
        qr: '/static/img/illustrations/attention.png',
      },
    }).as('getWhatsappZone');

    cy.visit('/backoffice/dashboard');
    cy.wait('@getCurrent');
    cy.wait('@getConversations');
    cy.contains('button', 'Rejoindre le groupe Whatsapp').click();
    cy.wait('@getWhatsappZone');
    cy.get('.ReactModal__Content').should('be.visible');
    cy.contains('Coachs de Paris').should('be.visible');
    // Wait for the end of the 200 ms fade-in so that the capture is reproducible.
    cy.get('.ReactModal__Overlay').should('have.css', 'opacity', '1');
    if (Cypress.expose('device') === 'mobile') {
      // On mobile the modal is a bottom sheet sliding up: wait until it rests on the bottom.
      cy.get('.ReactModal__Content').should(($content) => {
        expect(
          $content[0].getBoundingClientRect().bottom,
          'bottom sheet at rest'
        ).to.be.closeTo(Cypress.config('viewportHeight'), 1);
      });
    }

    cy.capture('Modale groupe WhatsApp', {
      caption: 'Modale ouverte depuis le bandeau du tableau de bord.',
      capture: 'viewport',
    });
  });
});
