import bootstrap from '../bootstrap';

describe('Referer', () => {
  /**
   * Nous générons toutes les fixtures
   */
  bootstrap();
  /**
   * À chaque fois:
   * - s'assurer que la modale ne s'affiche pas
   * - interceptions de multiple requêtes API (GET, POST, PUT)
   */
  beforeEach(() => {
    /**
     * Remove modal
     */
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', '1234');
    window.localStorage.setItem('release-version', 'v100');

    // to be done: use automatic generation and not static data
    cy.intercept('GET', '/auth/current', {
      fixture: 'auth-current-referer-res',
    }).as('authCheck');

    // to be done: use automatic generation and not static data
    cy.fixture('auth-current-referer-res').then((user) => {
      // to be done: use automatic generation and not static data
      cy.intercept('GET', `/user/${user.id}`, {
        fixture: 'auth-current-referer-res',
      });

      cy.intercept(
        'POST',
        `/user/profile/uploadImage/${user.id}`,
        '/assets/image-fixture.jpg'
      ).as('uploadImage');
    });

    cy.intercept('PUT', '/user/changePwd', {}).as('changePwd');

    cy.intercept('GET', `https://tarteaucitron.io/load.js*`, {});
  });

  describe('Referer - Parameters', () => {
    it('should open backoffice referer parameters', () => {
      cy.visit('/backoffice/parametres');

      // change password
      cy.get('#form-change-pwd-oldPassword').type('blablabla');
      cy.get('#form-change-pwd-newPassword').type('Linkedout123!');
      cy.get('#form-change-pwd-confirmPassword').type('Linkedout123!');
      cy.get('[data-testid="form-confirm-form-change-pwd"]').click();
      cy.wait('@changePwd');

      // to be done: use automatic generation and not static data
      cy.fixture('auth-current-referer-res').then((user) => {
        // check help needs and modify
        cy.intercept('PUT', `/user/profile/${user.id}`, {
          ...user,
          userProfile: {
            ...user.userProfile,
          },
          // fixture: 'user-profile-candidate-help-modified',
        }).as('putUserProfile');
      });

      // change profile picture
      cy.get(`[data-testid="profile-picture-upload-desktop"]`).selectFile(
        'assets/image-fixture.jpg',
        { force: true }
      );
      cy.wait('@uploadImage');
    });
  });
});
