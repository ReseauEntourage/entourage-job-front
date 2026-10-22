import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import {
  interceptCurrentUser,
  interceptLogin,
} from '../../intercept/user/auth.req';
import { buildCurrentUser } from '../../../fixtures/src/messaging/messagingBuilders';
import { buildTestPassword } from '../../../fixtures/src/user/buildTestPassword';
import bootstrap from '../bootstrap';

const PASSWORD_FIELD = '#form-finalize-account-setPassword';
const CONFIRM_FIELD = '#form-finalize-account-confirmPassword';
const SUBMIT_BUTTON = '[data-testid="form-confirm-form-finalize-account"]';

/**
 * Builds an unsigned JWT-shaped string carrying only an `exp` claim, which is
 * all the front reads to tell an expired activation link up front. The
 * backend remains the sole judge of the signature.
 */
const buildToken = (expiresInSeconds: number) => {
  const encode = (value: object) =>
    window.btoa(JSON.stringify(value)).replace(/=+$/, '');
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ exp })}.signature`;
};

const interceptFinalizeAccount = (data: object) => {
  cy.intercept('POST', '/auth/finalize-account', data).as(
    'postFinalizeAccount'
  );
};

const typePasswords = (password: string, confirmation = password) => {
  cy.get(PASSWORD_FIELD).should('be.visible').type(password);
  cy.get(CONFIRM_FIELD).type(confirmation);
};

describe('En tant que - Candidat orienté, je finalise mon compte', () => {
  bootstrap();

  // Generated per run so that no real-looking credential is committed
  const strongPassword = buildTestPassword();

  beforeEach(() => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.removeItem('access-token');
  });

  describe('Lien d’activation', () => {
    it('Affiche le formulaire de mot de passe quand le lien est valide', () => {
      cy.visit(`/finaliser-compte?token=${buildToken(3600)}`);

      cy.contains('Définir votre mot de passe').should('be.visible');
      cy.get(PASSWORD_FIELD).should('be.visible');
      cy.get(CONFIRM_FIELD).should('be.visible');
      cy.get(SUBMIT_BUTTON).should('be.visible');
    });

    it('Indique que le lien a expiré et propose d’en recevoir un nouveau', () => {
      cy.intercept('POST', '/auth/send-finalize-refered-user', {
        statusCode: 201,
        body: {},
      }).as('postSendFinalizeReferedUser');

      cy.visit(`/finaliser-compte?token=${buildToken(-3600)}`);

      cy.contains("Votre lien d'activation a expiré").should('be.visible');
      cy.get(PASSWORD_FIELD).should('not.exist');

      cy.contains('button', 'Recevoir un nouveau lien').click();
      cy.wait('@postSendFinalizeReferedUser')
        .its('request.body')
        .should('have.property', 'token');
      cy.contains(
        'Un nouveau lien vient de vous être envoyé par email.'
      ).should('be.visible');
    });

    it('Indique une erreur quand l’envoi d’un nouveau lien échoue', () => {
      cy.intercept('POST', '/auth/send-finalize-refered-user', {
        statusCode: 500,
        body: {},
      }).as('postSendFinalizeReferedUser');

      cy.visit(`/finaliser-compte?token=${buildToken(-3600)}`);

      cy.contains('button', 'Recevoir un nouveau lien').click();
      cy.wait('@postSendFinalizeReferedUser');
      cy.contains("Erreur lors de l'envoi de l'email").should('be.visible');
    });

    it('Indique que le lien n’est pas valide quand le serveur rejette le jeton', () => {
      interceptFinalizeAccount({
        statusCode: 400,
        body: { message: 'INVALID_TOKEN' },
      });

      cy.visit(`/finaliser-compte?token=${buildToken(3600)}`);
      typePasswords(strongPassword);
      cy.get(SUBMIT_BUTTON).click();

      cy.wait('@postFinalizeAccount');
      cy.contains("Ce lien d'activation n'est pas valide").should('be.visible');
    });

    it('Indique que le lien a expiré quand le serveur rejette le jeton pour expiration', () => {
      interceptFinalizeAccount({
        statusCode: 400,
        body: { message: 'TOKEN_EXPIRED' },
      });

      cy.visit(`/finaliser-compte?token=${buildToken(3600)}`);
      typePasswords(strongPassword);
      cy.get(SUBMIT_BUTTON).click();

      cy.wait('@postFinalizeAccount');
      cy.contains("Votre lien d'activation a expiré").should('be.visible');
      cy.contains('button', 'Recevoir un nouveau lien').should('be.visible');
    });
  });

  describe('Règles du mot de passe', () => {
    beforeEach(() => {
      interceptFinalizeAccount({
        statusCode: 201,
        body: 'candidat@example.com',
      });
      cy.visit(`/finaliser-compte?token=${buildToken(3600)}`);
    });

    it('Refuse un mot de passe trop faible', () => {
      typePasswords('abc');
      cy.get(SUBMIT_BUTTON).click();

      cy.contains('Doit répondre aux critères de sécurité').should(
        'be.visible'
      );
      cy.get('@postFinalizeAccount.all').should('have.length', 0);
    });

    it('Refuse deux mots de passe différents', () => {
      typePasswords(strongPassword, `${strongPassword}x`);
      cy.get(SUBMIT_BUTTON).click();

      cy.contains('Les deux mots de passe ne correspondent pas').should(
        'be.visible'
      );
      cy.get('@postFinalizeAccount.all').should('have.length', 0);
    });

    it('Refuse des champs vides', () => {
      cy.get(SUBMIT_BUTTON).click();

      cy.get('@postFinalizeAccount.all').should('have.length', 0);
      cy.url().should('include', '/finaliser-compte');
    });
  });

  describe('Validation du formulaire', () => {
    beforeEach(() => {
      cy.visit(`/finaliser-compte?token=${buildToken(3600)}`);
    });

    it('Enregistre le mot de passe, connecte le candidat et le redirige vers son tableau de bord', () => {
      // Dashboard rendering errors (endpoints not mocked here) shouldn't fail
      // a test that only asserts the redirect.
      cy.on('uncaught:exception', () => false);

      interceptFinalizeAccount({
        statusCode: 201,
        body: 'candidat@example.com',
      });
      interceptLogin({ statusCode: 200, body: { token: 'fake-access-token' } });
      interceptCurrentUser({
        statusCode: 200,
        body: buildCurrentUser({ role: 'Candidat' }),
      });
      interceptCurrentUserSubResources();

      typePasswords(strongPassword);
      cy.get(SUBMIT_BUTTON).click();

      cy.wait('@postFinalizeAccount').then(({ request }) => {
        expect(request.body.password).to.eq(strongPassword);
        expect(request.body).to.have.property('token');
      });
      cy.wait('@postLogin')
        .its('request.body.email')
        .should('eq', 'candidat@example.com');

      cy.url().should('include', '/backoffice/dashboard');
    });

    it('Indique que le compte est déjà finalisé', () => {
      interceptFinalizeAccount({
        statusCode: 400,
        body: { message: 'EMAIL_ALREADY_VERIFIED' },
      });

      typePasswords(strongPassword);
      cy.get(SUBMIT_BUTTON).click();

      cy.wait('@postFinalizeAccount');
      cy.contains('Vous avez déjà défini un mot de passe').should('be.visible');
    });

    it('Affiche une erreur générique quand le serveur est indisponible', () => {
      interceptFinalizeAccount({ statusCode: 500, body: {} });

      typePasswords(strongPassword);
      cy.get(SUBMIT_BUTTON).click();

      cy.wait('@postFinalizeAccount');
      cy.contains('Une erreur est survenue. Veuillez réessayer.').should(
        'be.visible'
      );
    });

    it('Indique que la connexion a échoué alors que le mot de passe est enregistré', () => {
      interceptFinalizeAccount({
        statusCode: 201,
        body: 'candidat@example.com',
      });
      interceptLogin({
        statusCode: 401,
        body: { message: 'INVALID_CREDENTIALS' },
      });

      typePasswords(strongPassword);
      cy.get(SUBMIT_BUTTON).click();

      cy.wait('@postFinalizeAccount');
      cy.wait('@postLogin');
      cy.contains('Votre mot de passe a bien été enregistré').should(
        'be.visible'
      );
      cy.url().should('include', '/finaliser-compte');
    });
  });
});
