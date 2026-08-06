import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import {
  interceptCurrentUser,
  interceptForgotPassword,
  interceptLogin,
} from '../../intercept/user/auth.req';
import bootstrap from '../bootstrap';

/**
 * Authentication flow: login, logout, forgot password, reset password.
 */
describe("En tant que - Visiteur, je m'authentifie", () => {
  /**
   * Generate all fixtures
   */
  bootstrap();

  beforeEach(() => {
    /**
     * Remove modal
     */
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.removeItem('access-token');
  });

  describe('Connexion', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.wait(500);
    });

    it('Je me connecte avec des identifiants valides et suis redirigé vers mon tableau de bord', () => {
      // Dashboard rendering errors (endpoints not mocked here) shouldn't fail
      // a test that only asserts the redirect.
      cy.on('uncaught:exception', () => false);

      interceptLogin({ statusCode: 200, body: { token: 'fake-access-token' } });
      interceptCurrentUser({ fixture: 'api/generated/candidate-login' });
      interceptCurrentUserSubResources();

      cy.get('#form-login-email').type('candidat@entourage.social');
      cy.get('#form-login-password').type('P@ssw0rd1234!');
      cy.get('[data-testid="form-confirm-form-login"]').click();

      cy.wait('@postLogin');
      cy.wait('@getCurrent');

      cy.url().should('include', '/backoffice/dashboard');
      cy.window()
        .its('localStorage')
        .invoke('getItem', 'access-token')
        .should('eq', 'fake-access-token');
    });

    it("Je vois un message d'erreur avec des identifiants invalides", () => {
      interceptLogin({
        statusCode: 401,
        body: { message: 'INVALID_CREDENTIALS' },
      });

      cy.get('#form-login-email').type('candidat@entourage.social');
      cy.get('#form-login-password').type('wrong-password');
      cy.get('[data-testid="form-confirm-form-login"]').click();

      cy.wait('@postLogin');
      cy.contains(
        'Erreur de connexion. Identifiant ou mot de passe invalide.'
      ).should('be.visible');
      cy.url().should('include', '/login');
      cy.window()
        .its('localStorage')
        .invoke('getItem', 'access-token')
        .should('be.null');
    });

    it("Je vois une proposition de renvoi d'email si mon adresse n'est pas vérifiée", () => {
      interceptLogin({
        statusCode: 401,
        body: { message: 'UNVERIFIED_EMAIL' },
      });

      cy.get('#form-login-email').type('non-verifie@entourage.social');
      cy.get('#form-login-password').type('P@ssw0rd1234!');
      cy.get('[data-testid="form-confirm-form-login"]').click();

      cy.wait('@postLogin');
      cy.contains("Votre adresse email n'a pas été vérifiée").should(
        'be.visible'
      );
      cy.contains('button', 'Me renvoyer un email de vérification').should(
        'be.visible'
      );
    });
  });

  describe('Mot de passe oublié', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.wait(500);
      cy.contains('Mot de passe oublié ?').click({ force: true });
      cy.get('.ReactModalPortal').should('be.visible');
    });

    it('Je reçois un message de confirmation après avoir renseigné mon email', () => {
      interceptForgotPassword({ statusCode: 200, body: {} });

      cy.get('#form-lost-pwd-email')
        .should('be.visible')
        .type('candidat@entourage.social');
      cy.get('[data-testid="form-confirm-form-lost-pwd"]').click();

      cy.wait('@postForgotPassword');
      cy.get('[data-testid="success-modal-content"]').should('be.visible');
      cy.contains("Un e-mail vient d'être envoyé à l'adresse indiquée.").should(
        'be.visible'
      );
    });

    it("Je vois un message d'erreur si l'adresse ne correspond à aucun compte", () => {
      interceptForgotPassword({ statusCode: 404, body: {} });

      cy.get('#form-lost-pwd-email')
        .should('be.visible')
        .type('inconnu@entourage.social');
      cy.get('[data-testid="form-confirm-form-lost-pwd"]').click();

      cy.wait('@postForgotPassword');
      cy.contains("L'adresse mail ne correspond à aucun utilisateur").should(
        'be.visible'
      );
    });

    it('Je vois un message dédié en cas de trop nombreuses tentatives', () => {
      interceptForgotPassword({ statusCode: 429, body: {} });

      cy.get('#form-lost-pwd-email')
        .should('be.visible')
        .type('candidat@entourage.social');
      cy.get('[data-testid="form-confirm-form-lost-pwd"]').click();

      cy.wait('@postForgotPassword');
      cy.contains('Trop de tentatives infructueuses.').should('be.visible');
    });
  });

  describe('Réinitialisation du mot de passe', () => {
    it("J'accède à un lien de réinitialisation invalide et vois un message dédié", () => {
      // With no backend running, token validation (done server-side via
      // getInitialProps, so not interceptable by cy.intercept) always fails,
      // which is exactly the "invalid link" state we want to exercise here —
      // the same one a real expired/wrong link produces in production.
      cy.visit('/reset/some-user-id/some-invalid-token');
      cy.wait(500);

      cy.contains('Ce lien ne semble pas valide').should('be.visible');
      cy.contains('button', "Retourner à l'accueil")
        .should('be.visible')
        .click();
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
  });
});

describe('En tant que - Candidat connecté, je me déconnecte', () => {
  bootstrap();

  beforeEach(() => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', '0x1x2x3x4');

    interceptCurrentUser({ fixture: 'api/generated/candidate-login' });
    interceptCurrentUserSubResources();

    cy.visit('/backoffice/dashboard');
    cy.wait('@getCurrent');
  });

  it('Je me déconnecte depuis le menu profil et mon token est supprimé', () => {
    cy.get('#nav-profile').should('be.visible').click({ force: true });
    cy.get('.dropdown-item').contains('Se déconnecter').click({ force: true });

    cy.window()
      .its('localStorage')
      .invoke('getItem', 'access-token')
      .should('be.null');
  });
});
