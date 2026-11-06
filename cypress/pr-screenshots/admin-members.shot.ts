import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import { interceptGetUnseenCount } from '../e2e/intercept/user/messaging.req';
import bootstrap from '../e2e/test/bootstrap';
import { buildCurrentUser } from '../fixtures/src/messaging/messagingBuilders';

const MEMBER_ID = '00000000-0000-0000-0000-0000000000aa';

describe('Gestion des membres (admin)', () => {
  bootstrap();

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
    interceptGetUnseenCount({ statusCode: 200, body: 0 });
  };

  it('liste des membres avec le filtre Zone ouvert', () => {
    interceptAdmin();
    cy.intercept('GET', '/user/members*', {
      fixture: 'api/generated/users-candidat',
    }).as('getMembers');

    cy.visit('/backoffice/admin/membres?role=Candidat');
    cy.wait('@getCurrent');
    cy.wait('@getMembers');
    cy.contains('Gestion des candidats').should('be.visible');

    cy.capture('Liste des membres', {
      caption: 'Filtres Zone et Métiers fermés.',
    });

    // The filters are hidden on mobile.
    if (Cypress.expose('device') === 'desktop') {
      cy.get('[data-testid="input-container-zone"]')
        .find('button')
        .first()
        .click();
      cy.get('[data-testid="input-container-zone"] .uk-dropdown').should(
        'be.visible'
      );
      cy.capture('Filtre Zone ouvert', {
        caption: 'Dropdown du filtre Zone ouvert, avec ses cases à cocher.',
        capture: 'viewport',
      });
    }
  });

  it('détail d’un membre et confirmation de suppression', () => {
    interceptAdmin();
    cy.intercept('GET', `/user/${MEMBER_ID}`, {
      statusCode: 200,
      body: {
        id: MEMBER_ID,
        firstName: 'Jeanne',
        lastName: 'Martin',
        email: 'jeanne.martin@example.com',
        phone: '0612345678',
        role: 'Candidat',
        zone: 'LYON',
        gender: 1,
        lastConnection: null,
        userProfile: { id: 'profile-jeanne', hasPicture: false },
      },
    }).as('getMember');

    cy.visit(`/backoffice/admin/membres/${MEMBER_ID}/parametres`);
    cy.wait('@getCurrent');
    cy.wait('@getMember');
    cy.contains('Jeanne Martin').should('be.visible');

    cy.capture('Détail d’un membre', {
      caption: 'En-tête avec la zone, onglet Paramètres.',
    });

    cy.contains('button', 'Supprimer').click();
    cy.get('.ReactModal__Content').should('be.visible');
    cy.capture('Confirmation de suppression', {
      caption: 'Modale de confirmation (pied de modale).',
      capture: 'viewport',
    });
  });
});
