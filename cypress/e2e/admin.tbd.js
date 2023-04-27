describe('Login', () => {
  beforeEach(() => {
    cy.intercept('GET', '/cv/shares', { total: 184222 }).as('cvShares');
    cy.intercept('POST', '/auth/login', { fixture: 'auth-login-admin-res' }).as(
      'login'
    );
    cy.intercept('GET', '/auth/current', {
      fixture: 'user-admin',
    }).as('authCheck');
    cy.intercept('GET', '/user/members/count', { pendingCVs: 0 });
    cy.intercept(
      'GET',
      '/user/members?limit=50&offset=0&role=Candidat&zone[]=LYON',
      {
        fixture: 'user-members-res',
      }
    ).as('members');
    cy.intercept(
      'GET',
      '/opportunity/admin?type=validated&department[]=Ain+(01)&department[]=Allier+(03)&department[]=Ard%C3%A8che+(07)&department[]=Cantal+(15)&department[]=Dr%C3%B4me+(26)&department[]=Is%C3%A8re+(38)&department[]=Loire+(42)&department[]=Haute-Loire+(43)&department[]=Puy-de-D%C3%B4me+(63)&department[]=Rh%C3%B4ne+(69)&department[]=Savoie+(73)&department[]=Haute-Savoie+(74)',
      {
        fixture: 'opportunity-admin-res',
      }
    ).as('offers');
    cy.intercept(
      'GET',
      `https://tarteaucitron.io/load.js*`,
      {}
    );
  });

  // it('should open backoffice offers', () => {
  //     cy.visit('/backoffice/admin/offres', {
  //         onBeforeLoad: function async (window) {
  //             window.localStorage.setItem('access-token', "1234");
  //         }
  //     })
  // })

  it('should open backoffice members', () => {
    cy.visit('/backoffice/admin/membres?role=Candidat&zone=LYON', {
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('access-token', '1234');
      },
    });
    cy.wait('@members');
    // test if all members are in the table
    cy.fixture('user-members-res').then((members) => {
      cy.get('[data-testid="member-list"]')
        .find('tr')
        .should('have.length', members.length);
    });
  });
});
