/* eslint-disable no-undef */
describe('Coach externe', () => {
  beforeEach(() => {
    cy.intercept('GET', '/auth/current', {
      fixture: 'coach/auth-current-coach-externe-res',
    }).as('authCheck');

    cy.intercept('GET', '/cv/*', {
      fixture: 'cv-for-candidat',
    }).as('cvForCandidat');

    cy.fixture('admin/auth-current-coach-externe-res').then((user) => {
      cy.intercept('GET', `/user/${user.id}`, {
        fixture: 'coach/auth-current-coach-externe-res',
      });
    });
  });

  it('should get candidate list', () => {
    cy.visit('/backoffice/candidat/list', {
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('access-token', '1234');
        window.localStorage.setItem('release-version', 'v100');
      },
    });

    cy.get('[data-testid="member-list"] > tr').its('length').should('eq', 2);
  });

  it('should get params for the user and possibility to return to list', () => {
    cy.visit('/backoffice/parametres', {
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('access-token', '1234');
        window.localStorage.setItem('release-version', 'v100');
      },
    });

    cy.get('[data-testid="linkeduser-email-span"]').should('not.exist');
  });
});
