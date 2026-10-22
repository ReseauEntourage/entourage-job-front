import { interceptResetPassword } from '../../intercept/user/auth.req';
import { buildTestPassword } from '../../../fixtures/src/user/buildTestPassword';
import bootstrap from '../bootstrap';

const USER_ID = '33333333-3333-4333-8333-333333333333';
const RESET_TOKEN = 'reset-token-for-tests';

const PASSWORD_FIELD = '#form-reset-pwd-newPassword';
const CONFIRM_FIELD = '#form-reset-pwd-confirmPassword';
const SUBMIT_BUTTON = '[data-testid="form-confirm-form-reset-pwd"]';

/**
 * The reset page validates its link in `getInitialProps`. A direct visit runs
 * it on the Next server, out of reach of `cy.intercept`; a client-side
 * navigation runs it in the browser, where the API call can be mocked.
 */
const navigateTo = (path: string) => {
  cy.visit('/');
  cy.window().then((win) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (win as any).next.router.push(path);
  });
};

const interceptResetToken = (statusCode: number) => {
  cy.intercept('GET', `/auth/reset/${USER_ID}/${RESET_TOKEN}`, {
    statusCode,
    body: {},
  }).as('getResetToken');
};

const typePasswords = (password: string, confirmation = password) => {
  cy.get(PASSWORD_FIELD).should('be.visible').type(password);
  cy.get(CONFIRM_FIELD).type(confirmation);
};

describe('En tant que - Membre, je réinitialise mon mot de passe', () => {
  bootstrap();

  // Generated per run so that no real-looking credential is committed
  const strongPassword = buildTestPassword();

  beforeEach(() => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.removeItem('access-token');
  });

  describe('Lien de réinitialisation', () => {
    it('Affiche le formulaire quand le lien est valide', () => {
      interceptResetToken(200);
      navigateTo(`/reset/${USER_ID}/${RESET_TOKEN}`);
      cy.wait('@getResetToken');

      cy.contains('Réinitialisation de mot de passe').should('be.visible');
      cy.get(PASSWORD_FIELD).should('be.visible');
      cy.get(CONFIRM_FIELD).should('be.visible');
    });

    it('Affiche un titre de création pour un nouveau compte', () => {
      interceptResetToken(200);
      navigateTo(`/reset/${USER_ID}/${RESET_TOKEN}?isCreation=true`);
      cy.wait('@getResetToken');

      cy.contains('Création de mot de passe').should('be.visible');
    });

    it('Indique que le lien n’est pas valide quand l’API le refuse', () => {
      interceptResetToken(400);
      navigateTo(`/reset/${USER_ID}/${RESET_TOKEN}`);
      cy.wait('@getResetToken');

      cy.contains('Ce lien ne semble pas valide').should('be.visible');
      cy.get(PASSWORD_FIELD).should('not.exist');
    });
  });

  describe('Règles du mot de passe', () => {
    beforeEach(() => {
      interceptResetToken(200);
      interceptResetPassword({ statusCode: 201, body: {} });
      navigateTo(`/reset/${USER_ID}/${RESET_TOKEN}`);
      cy.wait('@getResetToken');
    });

    it('Refuse un mot de passe trop faible', () => {
      typePasswords('abc');
      cy.get(SUBMIT_BUTTON).click();

      cy.contains('Doit répondre aux critères de sécurité').should(
        'be.visible'
      );
      cy.get('@postResetPassword.all').should('have.length', 0);
    });

    it('Refuse deux mots de passe différents', () => {
      typePasswords(strongPassword, `${strongPassword}x`);
      cy.get(SUBMIT_BUTTON).click();

      cy.contains('Les deux mots de passe ne correspondent pas').should(
        'be.visible'
      );
      cy.get('@postResetPassword.all').should('have.length', 0);
    });
  });

  describe('Validation du formulaire', () => {
    beforeEach(() => {
      interceptResetToken(200);
      navigateTo(`/reset/${USER_ID}/${RESET_TOKEN}`);
      cy.wait('@getResetToken');
    });

    it('Enregistre le nouveau mot de passe puis confirme la réinitialisation', () => {
      interceptResetPassword({ statusCode: 201, body: {} });

      typePasswords(strongPassword);
      cy.get(SUBMIT_BUTTON).click();

      cy.wait('@postResetPassword').then(({ request }) => {
        expect(request.body.newPassword).to.eq(strongPassword);
        expect(request.body.confirmPassword).to.eq(strongPassword);
      });
      cy.url().should('include', '/reset/success');
      cy.contains('button', 'Se connecter').click();
      cy.url().should('include', '/login');
    });

    it('Affiche une erreur quand l’API refuse le nouveau mot de passe', () => {
      interceptResetPassword({ statusCode: 500, body: {} });

      typePasswords(strongPassword);
      cy.get(SUBMIT_BUTTON).click();

      cy.wait('@postResetPassword');
      cy.contains('Une erreur est survenue').should('be.visible');
      cy.url().should('not.include', '/reset/success');
    });
  });
});
