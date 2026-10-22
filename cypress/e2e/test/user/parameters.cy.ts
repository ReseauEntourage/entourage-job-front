import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import { interceptCurrentUser } from '../../intercept/user/auth.req';
import { buildCurrentUser } from '../../../fixtures/src/messaging/messagingBuilders';
import {
  interceptRealtime,
  blockRealtimeSockets,
} from '../../intercept/realtime.req';
import bootstrap from '../bootstrap';

const signInAs = (role: string) => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  window.localStorage.setItem('access-token', 'fake-access-token');
  interceptCurrentUser({ statusCode: 200, body: buildCurrentUser({ role }) });
  interceptCurrentUserSubResources();
  interceptRealtime();
};

describe('En tant que - Membre connecté, je gère mes paramètres', () => {
  bootstrap();

  ['Coach', 'Candidat'].forEach((role) => {
    it(`Affiche mes informations et les cartes de profil (${role})`, () => {
      signInAs(role);

      cy.visit('/backoffice/parametres', {
        onBeforeLoad: blockRealtimeSockets,
      });
      cy.wait('@getCurrent');

      cy.contains('Ces informations sont visibles uniquement par vous').should(
        'be.visible'
      );
      cy.contains('Télécharger mon CV').should('be.visible');
      cy.contains('Présentation').should('be.visible');
    });
  });

  it('Redirige un visiteur non connecté vers la page de connexion', () => {
    cy.intercept('GET', '/current', { statusCode: 401, body: {} }).as(
      'getCurrentUnauthorized'
    );

    cy.visit('/backoffice/parametres');

    cy.url().should('include', '/login');
  });
});
