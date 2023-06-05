import organizations from '../fixtures/organization-search-res.json';

const entourageOrganizationId = organizations.find(
  ({ name }) => name === 'Entourage'
).id;

describe('Admin', () => {
  beforeEach(() => {
    cy.intercept('GET', '/cv/shares', { total: 184222 }).as('cvShares');

    cy.intercept('GET', '/auth/current', {
      fixture: 'auth-login-admin-res',
    }).as('authCheck');

    cy.intercept('GET', '/user/members/count', { pendingCVs: 0 });
    cy.intercept(
      'GET',
      '/user/members?limit=50&offset=0&role[]=Candidat&zone[]=LYON',
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
      fixture: 'organization-res',
    }).as('postOrganization');

    cy.intercept('POST', '/user', {
      statusCode: 201,
      fixture: 'user-res',
    }).as('postUser');

    cy.intercept('GET', '/user/search?query=&role=', {
      fixture: 'user-admin-coaches-search-res',
    }).as('getNormalCoaches');

    cy.intercept('GET', '/user/search?query=Jane&role=Coach', {
      fixture: 'user-admin-coaches-search-res',
    }).as('getNormalCoaches');

    cy.intercept('GET', '/user/search?query=Jane&role=Candidat', {
      fixture: 'user-admin-candidates-search-res',
    }).as('getNormalCandidates');

    cy.intercept(
      'GET',
      `/user/search?query=Jane&role=Coach+externe&organizationId=${entourageOrganizationId}`,
      {
        fixture: 'user-admin-coaches-search-res',
      }
    ).as('getExternalCoaches');

    cy.intercept(
      'GET',
      `/user/search?query=Jane&role=Candidat+externe&organizationId=${entourageOrganizationId}`,
      {
        fixture: 'user-admin-candidates-search-res',
      }
    ).as('getExternalCandidates');

    cy.intercept('get', '/organization?search=*', {
      fixture: 'organization-search-res',
    }).as('getOrganizations');
  });

  it('Should open backoffice offers', () => {
    cy.visit('/backoffice/admin/offres', {
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('access-token', '1234');
      },
    });
    cy.wait('@offers');
    // test if all offer are in the table
    cy.fixture('opportunity-admin-res').then((offers) => {
      cy.get('[data-testid="offer-list"]')
        .find('li')
        .should('have.length', offers.length);
    });
  });

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
      .find('button')
      .contains('Paris')
      .click();

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

    cy.get('button')
      .contains('Créer la structure')
      .should('be.visible')
      .click();

    cy.wait('@postOrganization');

    cy.get('.ReactModalPortal div').should('not.exist');
  });

  describe("Remplir le formulaire de création d'un membre, envoyer et fermer", () => {
    beforeEach(() => {
      cy.get('[data-testid="button-admin-create"]')
        .should('be.visible')
        .first()
        .scrollIntoView()
        .click();

      cy.get('[data-testid="button-create-user"]')
        .should('be.visible')
        .first()
        .scrollIntoView()
        .click();

      cy.get('.ReactModalPortal div').first().should('be.visible');

      cy.get('#form-add-user-userToLinkId').should('not.exist');

      cy.get('#form-add-user-firstName')
        .should('be.visible')
        .scrollIntoView()
        .type('John');

      cy.get('#form-add-user-lastName')
        .should('be.visible')
        .scrollIntoView()
        .type('Doe');

      cy.get('#form-add-user-gender-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .get('button')
        .contains('Homme')
        .click();

      cy.get('#form-add-user-zone-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('button')
        .contains('Paris')
        .click();

      cy.get('#form-add-user-phone')
        .should('be.visible')
        .scrollIntoView()
        .type('0698754321');

      cy.get('#form-add-user-email')
        .should('be.visible')
        .scrollIntoView()
        .type('johndoe@gmail.com');
    });

    describe("Creation d'un user sans créer de structure", () => {
      afterEach(() => {
        cy.get('button')
          .contains('Ajouter')
          .should('be.visible')
          .scrollIntoView()
          .click();

        cy.wait('@postUser');

        cy.get('.ReactModalPortal div').should('not.exist');
      });

      it('Créer un admin', () => {
        cy.get('#form-add-user-role-container')
          .should('be.visible')
          .scrollIntoView()
          .click()
          .find('button')
          .contains('Admin')
          .click();

        cy.get('#form-add-user-organizationId').should('not.exist');

        cy.get('#form-add-user-userToLinkId').should('not.exist');

        cy.get('[id$=Organization]').should('not.exist');

        cy.get('#form-add-user-adminRole-container')
          .should('be.visible')
          .scrollIntoView()
          .click()
          .find('button')
          .contains('Candidats')
          .click();
      });

      it('Créer un candidat normal', () => {
        cy.get('#form-add-user-role-container')
          .should('be.visible')
          .scrollIntoView()
          .click()
          .find('button')
          .contains('Candidat LKO')
          .click();

        cy.get('#form-add-user-organizationId').should('not.exist');

        cy.get('#form-add-user-adminRole-container').should('not.exist');

        cy.get('[id$=Organization]').should('not.exist');

        cy.get('#form-add-user-userToLinkId')
          .should('be.visible')
          .scrollIntoView()
          .type('Jane');

        cy.wait('@getNormalCoaches');

        cy.get('#form-add-user-userToLinkId')
          .find('.Select__menu')
          .should('be.visible')
          .scrollIntoView()
          .find('.Select__option')
          .contains('Jane Doe')
          .click();
      });

      it('Créer un coach normal', () => {
        cy.get('#form-add-user-role-container')
          .should('be.visible')
          .scrollIntoView()
          .click()
          .find('button')
          .contains('Coach LKO')
          .click();

        cy.get('#form-add-user-organizationId').should('not.exist');

        cy.get('#form-add-user-adminRole-container').should('not.exist');

        cy.get('[id$=Organization]').should('not.exist');

        cy.get('#form-add-user-userToLinkId')
          .should('be.visible')
          .scrollIntoView()
          .type('Jane');

        cy.wait('@getNormalCandidates');

        cy.get('#form-add-user-userToLinkId')
          .find('.Select__menu')
          .should('be.visible')
          .scrollIntoView()
          .find('.Select__option')
          .contains('Jane Doe')
          .click();
      });

      it('Créer un candidat externe', () => {
        cy.get('#form-add-user-role-container')
          .should('be.visible')
          .scrollIntoView()
          .click()
          .find('button')
          .contains('Candidat externe')
          .click();

        cy.get('#form-add-user-adminRole-container').should('not.exist');

        cy.get('#form-add-user-userToLinkId').should('not.exist');

        cy.get('[id$=Organization]').should('not.exist');

        cy.get('#form-add-user-organizationId')
          .should('be.visible')
          .scrollIntoView()
          .type('Entourage');

        cy.wait('@getOrganizations');

        cy.get('#form-add-user-organizationId')
          .find('.Select__menu')
          .should('be.visible')
          .scrollIntoView()
          .find('.Select__option')
          .contains('Entourage')
          .click();

        cy.get('#form-add-user-userToLinkId')
          .should('be.visible')
          .scrollIntoView()
          .type('Jane');

        cy.wait('@getExternalCoaches');

        cy.get('#form-add-user-userToLinkId')
          .find('.Select__menu')
          .should('be.visible')
          .scrollIntoView()
          .find('.Select__option')
          .contains('Jane Doe')
          .click();
      });

      it('Créer un coach externe', () => {
        cy.get('#form-add-user-role-container')
          .should('be.visible')
          .scrollIntoView()
          .click()
          .find('button')
          .contains('Coach externe')
          .click();

        cy.get('#form-add-user-userToLinkId').should('not.exist');

        cy.get('#form-add-user-adminRole-container').should('not.exist');

        cy.get('#form-add-user-organizationId')
          .should('be.visible')
          .scrollIntoView()
          .type('Entourage');

        cy.wait('@getOrganizations');

        cy.get('#form-add-user-organizationId')
          .find('.Select__menu')
          .should('be.visible')
          .scrollIntoView()
          .get('.Select__option')
          .contains('Entourage')
          .click();

        cy.get('#form-add-user-userToLinkId')
          .should('be.visible')
          .scrollIntoView()
          .type('Jane');

        cy.wait('@getExternalCandidates');

        cy.get('#form-add-user-userToLinkId')
          .find('.Select__menu')
          .should('be.visible')
          .scrollIntoView()
          .find('.Select__option')
          .contains('Jane Doe')
          .click();
      });
    });

    describe("Creation d'un user et d'une structure", () => {
      afterEach(() => {
        cy.get('#form-add-user-adminRole-container').should('not.exist');

        cy.get('#form-add-user-userToLinkId').should('not.exist');

        cy.get('#form-add-user-organizationId')
          .should('be.visible')
          .scrollIntoView()
          .click()
          .find('.Select__menu')
          .should('be.visible')
          .scrollIntoView()
          .find('.Select__option')
          .contains('Ajouter une nouvelle structure')
          .click();

        cy.get('#form-add-user-userToLinkId').should('not.exist');

        cy.get('[id$=Organization]').should('be.visible');

        cy.get('#form-add-user-nameOrganization')
          .should('be.visible')
          .scrollIntoView()
          .type('Entourage');

        cy.get('#form-add-user-addressOrganization')
          .should('be.visible')
          .scrollIntoView()
          .type('174 rue Championnet, 75015 Paris');

        cy.get('#form-add-user-zoneOrganization-container')
          .should('be.visible')
          .scrollIntoView()
          .click()
          .find('button')
          .contains('Paris')
          .click();

        cy.get('#form-add-user-referentFirstNameOrganization')
          .should('be.visible')
          .scrollIntoView()
          .type('Bruce');

        cy.get('#form-add-user-referentLastNameOrganization')
          .should('be.visible')
          .scrollIntoView()
          .type('Wayne');

        cy.get('#form-add-user-referentPhoneOrganization')
          .should('be.visible')
          .scrollIntoView()
          .type('0665756521');

        cy.get('#form-add-user-referentMailOrganization')
          .should('be.visible')
          .scrollIntoView()
          .type('brucewayne@gmail.com');

        cy.get('button')
          .contains('Ajouter')
          .should('be.visible')
          .scrollIntoView()
          .click();

        cy.wait('@postOrganization');

        cy.wait('@postUser');

        cy.get('.ReactModalPortal div').should('not.exist');
      });

      it('Créer un candidat externe et une structure', () => {
        cy.get('#form-add-user-role-container')
          .should('be.visible')
          .scrollIntoView()
          .click()
          .find('button')
          .contains('Candidat externe')
          .click();
      });

      it('Créer un coach externe et une structure', () => {
        cy.get('#form-add-user-role-container')
          .should('be.visible')
          .scrollIntoView()
          .click()
          .find('button')
          .contains('Coach externe')
          .click();
      });
    });
  });
});
