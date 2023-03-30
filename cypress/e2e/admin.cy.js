describe('Admin', () => {
  beforeEach(() => {
    cy.intercept('GET', '/cv/shares', { total: 184222 }).as('cvShares');

    cy.intercept('GET', '/auth/current', {
      fixture: 'auth-login-admin-res',
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

    cy.intercept('POST', '/organization', {
      statusCode: 201,
      fixture: 'organization-res'
    }).as('postOrganization');
  });

  it('Should open backoffice offers', () => {
      cy.visit('/backoffice/admin/offres', {
          onBeforeLoad: function async (window) {
              window.localStorage.setItem('access-token', "1234");
          }
      })
    cy.wait('@offers');
    // test if all offer are in the table
    cy.fixture('opportunity-admin-res').then((offers) => {
      cy.get('[data-testid="offer-list"]')
        .find('li')
        .should('have.length', offers.length);
    });
  })

  it('Should open backoffice members', () => {
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

  it("Remplir le formulaire de création d'une structure, envoyer et fermer", () => {
    cy.get('[data-testid="button-admin-create"]')
      .should('be.visible')
      .first()
      .scrollIntoView()
      .click();

    cy.get('[data-testid="button-create-organization"]')
      .should('be.visible')
      .first()
      .scrollIntoView()
      .click();

    cy.get('.ReactModalPortal div').first().should('be.visible');

    cy.get('#form-add-organization-name')
      .should('be.visible')
      .scrollIntoView()
      .type('Entourage');

    cy.get('#form-add-organization-address')
      .should('be.visible')
      .scrollIntoView()
      .type('174 rue Championnet, 75015 Paris');

    cy.get('#form-add-organization-zone-container')
      .should('be.visible')
      .scrollIntoView()
      .click()
      .get('button').contains('Paris').click()

    cy.get('#form-add-organization-referentFirstName')
      .should('be.visible')
      .scrollIntoView()
      .type('John');

    cy.get('#form-add-organization-referentLastName')
      .should('be.visible')
      .scrollIntoView()
      .type('Doe');

    cy.get('#form-add-organization-referentPhone')
      .should('be.visible')
      .scrollIntoView()
      .type('0698754321');

    cy.get('#form-add-organization-referentMail')
      .should('be.visible')
      .scrollIntoView()
      .type('johndoe@gmail.com');

    cy.get('button').contains('Créer la structure').should('be.visible').click();

    cy.wait('@postOrganization');

    cy.get('.ReactModalPortal div').should('not.exist');
  });
});
