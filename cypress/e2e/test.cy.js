/* eslint-disable no-undef */
import { userOpportunityAllRes } from '../fixtures/candidat/opportunity/user-opportunity-all-res';

// const opportunity = userOpportunityAllRes(1);

describe("En tant qu'Administrateur", () => {
  // before each it()
  before(() => {
    cy.generateAdminFixture();

    // cy.intercept('GET', '/auth/current', {
    //   fixture: 'admin/login/auth-login-admin-res',
    // }).as('authCheck');

    // cy.intercept('GET', '/opportunity/admin**', {
    //   fixture: 'admin/opportunities',
    // }).as('getOpportunities');
  });

  it('Test #1 - acces au back office', () => {
    //   cy.visit('/backoffice/admin**', {
    //     onBeforeLoad: function async(window) {
    //       window.localStorage.setItem('access-token', '1234');
    //       window.localStorage.setItem('release-version', 'v100');
    //     },
    //   });
    //   cy.visit('/backoffice/admin/offres');
    //   cy.wait('@getOpportunities').then(() => {
    //     cy.get('[data-testid="admin-offer-list-element"]')
    //       .its('length')
    //       .should('eq', offers.length);
    //     cy.url().should('include', offers[0].id);
    //   });
  });
});
