/* eslint-disable no-undef */
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

    cy.intercept('GET', '/opportunity/admin**', {
      fixture: 'opportunities-admin-res',
    }).as('offers');

    cy.intercept('GET', '/opportunity/84fe74bf-7998-4653-9150-906781bfdb91', {
      fixture: 'opportunity-admin-res',
    }).as('offer');

    cy.intercept('POST', '/organization', {
      statusCode: 201,
      fixture: 'organization-res',
    }).as('postOrganization');

    cy.intercept('PUT', `/organization/${entourageOrganizationId}`, {
      statusCode: 201,
      fixture: 'organization-res',
    }).as('putOrganization');

    cy.intercept('POST', '/user', {
      statusCode: 201,
      fixture: 'user-res',
    }).as('postUser');

    cy.intercept('GET', '/user/search?query=&role=Coach', {
      fixture: 'user-admin-coaches-search-res',
    });

    cy.intercept('GET', '/user/search?query=Jane&role=Coach', {
      fixture: 'user-admin-coaches-search-res',
    }).as('getNormalCoaches');

    cy.intercept('GET', '/user/search?query=&role=Candidat', {
      fixture: 'user-admin-coaches-search-res',
    });

    cy.intercept('GET', '/user/search?query=Jane&role=Candidat', {
      fixture: 'user-admin-candidates-search-res',
    }).as('getNormalCandidates');

    cy.intercept(
      'GET',
      `/user/search?query=&role=Coach+externe&organizationId=${entourageOrganizationId}`,
      {
        fixture: 'user-admin-coaches-search-res',
      }
    );

    cy.intercept(
      'GET',
      `/user/search?query=Jane&role=Coach+externe&organizationId=${entourageOrganizationId}`,
      {
        fixture: 'user-admin-coaches-search-res',
      }
    ).as('getExternalCoaches');

    cy.intercept(
      'GET',
      `/user/search?query=&role=Candidat+externe&organizationId=${entourageOrganizationId}`,
      {
        fixture: 'user-admin-coaches-search-res',
      }
    );

    cy.intercept(
      'GET',
      `/user/search?query=Jane&role=Candidat+externe&organizationId=${entourageOrganizationId}`,
      {
        fixture: 'user-admin-candidates-search-res',
      }
    ).as('getExternalCandidatesJane');

    cy.intercept(
      'GET',
      `/user/search?query=Emile&role=Candidat+externe&organizationId=${entourageOrganizationId}`,
      {
        fixture: 'user-admin-candidates-search-res',
      }
    ).as('getExternalCandidatesEmile');

    cy.intercept('GET', '/organization?limit=50&offset=0&zone[]=LYON', {
      fixture: 'organization-search-res',
    }).as('organizationListPage');

    cy.intercept('GET', '/organization?search=Entourage&limit=50&offset=0', {
      fixture: 'organization-search-res',
    }).as('searchOrganizationsListUpdateCreate');

    cy.intercept('GET', '/organization?search=&limit=50&offset=0', {
      fixture: 'organization-search-res',
    }).as('getOrganizationListUpdateCreate');

    cy.intercept('POST', '/opportunity', {
      fixture: 'opportunity-res',
    }).as('postOpportunity');
  });

  describe('Offers', () => {
    it('Should open backoffice offers', () => {
      cy.visit('/backoffice/admin/offres', {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('access-token', '1234');
          window.localStorage.setItem('release-version', 'v100');
        },
      });
      cy.wait('@offers');
      cy.wait('@offer');
      // test if all offer are in the table and if url contains first offer
      cy.fixture('opportunities-admin-res').then((offers) => {
        cy.get('[data-testid="admin-offer-list-element"]')
          .its('length')
          .should('eq', offers.length);
        cy.url().should('include', offers[0].id);
      });

      // change tabs
      cy.get('[data-testid="admin-offer-tab-validated"]').click();
      cy.url().should('include', 'validated');
      cy.get('[data-testid="admin-offer-tab-external"]').click();
      cy.url().should('include', 'external');
      cy.get('[data-testid="admin-offer-tab-archived"]').click();
      cy.url().should('include', 'archived');

      // reset filters
      cy.get('[data-testid="reset-filters"]').click();
      cy.url().should('not.include', 'department');

      // add an offer
      cy.get('[data-testid="button-admin-create"]').click();
      cy.get('[data-testid="admin-add-offer-main"]').click();
      cy.get('#form-add-offer-admin-title').scrollIntoView().type('test');
      cy.get('#form-add-offer-admin-company').scrollIntoView().type('test');

      cy.get('#form-add-offer-admin-department')
        .should('be.visible')
        .scrollIntoView()
        .type('Par');

      cy.get('#form-add-offer-admin-department')
        .find('.Select__menu')
        .scrollIntoView()
        .should('be.visible')
        .find('.Select__option')
        .contains('Paris (75)')
        .click();
      cy.get('#form-add-offer-admin-address')
        .scrollIntoView()
        .should('be.visible')
        .type('description');

      cy.get('#form-add-offer-admin-companyDescription')
        .scrollIntoView()
        .should('be.visible')
        .type('description');

      cy.get('#form-add-offer-admin-contract-container')
        .scrollIntoView()
        .should('be.visible')
        .click()
        .find('.option')
        .contains('CDI')
        .click();

      cy.get('#form-add-offer-admin-recruiterFirstName')
        .scrollIntoView()
        .type('test');
      cy.get('#form-add-offer-admin-recruiterName').scrollIntoView().type('test');
      cy.get('#form-add-offer-admin-recruiterPosition').scrollIntoView().type('test');
      cy.get('#form-add-offer-admin-recruiterMail')
        .scrollIntoView()
        .type('test@gmail.com');

      cy.get('#form-add-offer-admin-businessLines')
        .should('be.visible')
        .scrollIntoView()
        .type('Agr');

      cy.get('#form-add-offer-admin-businessLines')
        .find('.Select__menu')
        .scrollIntoView()
        .should('be.visible')
        .find('.Select__option')
        .contains('Agriculture et espaces verts')
        .click();

      cy.get('#form-add-offer-admin-description').scrollIntoView().type('test');
      cy.get('button').contains('Valider').click();
      cy.wait('@postOpportunity');

      cy.get('.uk-modal-body').should('not.exist');
    });
  });

  describe('Members', () => {
    it('Should open backoffice members', () => {
      cy.visit('/backoffice/admin/membres?role=Candidat&zone=LYON', {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('access-token', '1234');
          window.localStorage.setItem('release-version', 'v100');
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
          .find('.option')
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
            .find('.option')
            .contains('Admin')
            .click();

          cy.get('#form-add-user-organizationId').should('not.exist');

          cy.get('#form-add-user-userToLinkId').should('not.exist');

          cy.get('[id$=Organization]').should('not.exist');

          cy.get('#form-add-user-adminRole-container')
            .should('be.visible')
            .scrollIntoView()
            .click()
            .find('.option')
            .contains('Candidats')
            .click();
        });

        it('Créer un candidat normal', () => {
          cy.get('#form-add-user-role-container')
            .should('be.visible')
            .scrollIntoView()
            .click()
            .find('.option')
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
            .find('.option')
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
            .find('.option')
            .contains('Candidat externe')
            .click();

          cy.get('#form-add-user-adminRole-container').should('not.exist');

          cy.get('#form-add-user-userToLinkId').should('not.exist');

          cy.get('[id$=Organization]').should('not.exist');

          cy.get('#form-add-user-organizationId')
            .should('be.visible')
            .scrollIntoView()
            .type('Entourage');

          cy.wait('@searchOrganizationsListUpdateCreate');

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
            .find('.option')
            .contains('Coach externe')
            .click();

          cy.get('#form-add-user-userToLinkId').should('not.exist');

          cy.get('#form-add-user-adminRole-container').should('not.exist');

          cy.get('#form-add-user-organizationId')
            .should('be.visible')
            .scrollIntoView()
            .type('Entourage');

          cy.wait('@searchOrganizationsListUpdateCreate');

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

          cy.wait('@getExternalCandidatesJane');

          cy.get('#form-add-user-userToLinkId')
            .find('.Select__menu')
            .should('be.visible')
            .scrollIntoView()
            .find('.Select__option')
            .contains('Jane Doe')
            .click();

          cy.get('#form-add-user-userToLinkId')
            .should('be.visible')
            .scrollIntoView()
            .type('Emile');

          cy.wait('@getExternalCandidatesEmile');

          cy.get('#form-add-user-userToLinkId')
            .find('.Select__menu')
            .should('be.visible')
            .scrollIntoView()
            .find('.Select__option')
            .contains('Emile Sf Bex')
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
            .click();

          cy.wait('@getOrganizationListUpdateCreate');

          cy.get('#form-add-user-organizationId')
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
            .find('.option')
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
            .find('.option')
            .contains('Candidat externe')
            .click();
        });

        it('Créer un coach externe et une structure', () => {
          cy.get('#form-add-user-role-container')
            .should('be.visible')
            .scrollIntoView()
            .click()
            .find('.option')
            .contains('Coach externe')
            .click();
        });
      });
    });
  });
  describe('Organizations', () => {
    it('Should open backoffice organizations', () => {
      cy.visit('/backoffice/admin/structures?zone=LYON', {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('access-token', '1234');
          window.localStorage.setItem('release-version', 'v100');
        },
      });
      cy.wait('@organizationListPage');
      // test if all organizations are in the table
      cy.fixture('organization-search-res').then((orgs) => {
        cy.get('[data-testid="organization-list"]')
          .find('tr')
          .should('have.length', orgs.length);
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
        .find('.option')
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

    it("Remplir le formulaire d'édition d'une structure, envoyer et fermer", () => {
      cy.get(
        `[data-testid="button-edit-organization-${entourageOrganizationId}"]`
      )
        .should('be.visible')
        .first()
        .scrollIntoView()
        .click();

      cy.get('.ReactModalPortal div').first().should('be.visible');

      cy.get('#form-add-organization-name')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type('LinkedOut');

      cy.get('#form-add-organization-address')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type('15 Avenue Lacassagne, 69003 Lyon');

      cy.get('#form-add-organization-zone-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Lyon')
        .click();

      cy.get('#form-add-organization-referentFirstName')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type('Jane');

      cy.get('#form-add-organization-referentLastName')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type('Fonda');

      cy.get('#form-add-organization-referentPhone')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type('0666059439');

      cy.get('#form-add-organization-referentMail')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type('janefonda@gmail.com');

      cy.get('button')
        .contains('Modifier la structure')
        .should('be.visible')
        .click();

      cy.wait('@putOrganization');

      cy.get('.ReactModalPortal div').should('not.exist');
    });
  });
});
