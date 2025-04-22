import { adminRequests } from '../../intercept/user/admin.req';
import bootstrap from '../bootstrap';

/**
 * En tant qu'Administrateur
 */
describe('En tant que - Administrateur', () => {
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
    window.localStorage.setItem('access-token', '0x1x2x3x4');
    window.localStorage.setItem('release-version', 'v100');

    /**
     * Intercept requests
     */
    adminRequests.GET.forEach((request) => {
      if (request.alias) {
        cy.intercept('GET', request.path, request.data).as(request.alias);
      } else cy.intercept('GET', request.path, request.data);
    });
    adminRequests.POST.forEach((request) => {
      if (request.alias) {
        cy.intercept('POST', request.path, request.data).as(request.alias);
      } else cy.intercept('POST', request.path, request.data);
    });
    adminRequests.PUT.forEach((request) => {
      if (request.alias) {
        cy.intercept('PUT', request.path, request.data).as(request.alias);
      } else cy.intercept('PUT', request.path, request.data);
    });
  });

  /**
   * Je parcours les membres
   */
  describe('Je parcours les membres', () => {
    beforeEach(() => {
      cy.visit('/backoffice/admin/membres?role=Candidat');
    });

    /**
     * Première partie de test - J'affiche les membres.
     */
    it("J'affiche les membres", () => {
      // Grâce au fichier de fixture précédement généré
      cy.fixture('api/generated/users-candidat').then((candidates) => {
        cy.get('[data-testid="member-list"]')
          .find('tr')
          .should('have.length', candidates.length);
      });
    });

    /**
     * Deuxième partie de test - création des membres: admin, candidat, coach...
     */
    const fillUserForm = (roleUser) => {
      // Nous remplissons le formulaire pour chaque role ICI
      cy.get('[data-testid="button-admin-create"]')
        .should('be.visible')
        .first()
        .click();

      cy.get('[data-testid="button-create-user"]')
        .should('be.visible')
        .first()
        .click();

      cy.get('.ReactModalPortal div').first().should('be.visible');

      cy.get('#form-add-user-firstName').should('be.visible').type('John');

      cy.get('#form-add-user-lastName').should('be.visible').type('Doe');

      cy.get('#form-add-user-gender-container button')
        .should('be.visible')
        .click();
      cy.get('#form-add-user-gender-container')
        .get('.option')
        .contains('Homme')
        .click();

      cy.get('#form-add-user-zone-container button')
        .should('be.visible')
        .click();
      cy.get('#form-add-user-zone-container')
        .find('.option')
        .contains('Paris')
        .click();

      cy.get('#form-add-user-phone').should('be.visible').type('0650304020');

      cy.get('#form-add-user-email')
        .should('be.visible')
        .type('johndoe@gmail.com');

      cy.get('[data-testid="form-add-user-role"]')
        .should('be.visible')
        .click()
        .get('button')
        .contains(roleUser)
        .click();
    };
    const submitUserForm = () => {
      // Clic sur le bouton d'ajout
      cy.get('button').contains('Ajouter').should('be.visible').click();
      // Interception de la requête POST (HTTP 201) - check apiRequests.js
      cy.wait('@postCandidate');
      // Vérification de la modal non existante
      cy.get('.ReactModalPortal div').should('not.exist');
    };

    /**
     * ** Création du membre "admin"
     */
    it("J'ajoute un membre - Admin", () => {
      fillUserForm('Admin');

      cy.get('#form-add-user-organizationId').should('not.exist');
      cy.get('#form-add-user-userToLinkId').should('not.exist');
      cy.get('[id$=Organization]').should('not.exist');

      cy.get('#form-add-user-adminRole-container button')
        .should('be.visible')
        .click();
      cy.get('#form-add-user-adminRole-container')
        .find('.option')
        .contains('Candidats')
        .click();

      cy.get('button').contains('Ajouter').should('be.visible').click();

      cy.wait('@postCandidate');

      cy.get('.ReactModalPortal div').should('not.exist');
    });

    /**
     * ** Création du nouveau membre "candidate"
     * ** à savoir - "coach lko" est exactement pareil (inutile de tester)
     */
    it("J'ajoute un nouveau membre - Candidat/Coach LKO", () => {
      // Insertion des informations de base d'un utilisateur - role Candidat
      fillUserForm('Candidat');

      // Assertion - vérifications que les champs ci-dessous ne sont pas affichés à cet instant
      cy.get('#form-add-user-organizationId').should('not.exist');
      cy.get('#form-add-user-adminRole-container').should('not.exist');
      cy.get('[id$=Organization]').should('not.exist');

      // Chargement du fichier de fixture search-user.json - inutile de se soucier du type (non utile)
      cy.fixture('api/generated/search-user').then((users) => {
        const firstUser = users[0];

        // Saisie du nom de l'utilisateur
        cy.get('#form-add-user-userToLinkId')
          .should('be.visible')
          .type(firstUser.firstName);

        // Puis sélection de l'utilisateur dans le menu déroulant
        cy.get('#form-add-user-userToLinkId')
          .find('.Select__menu')
          .should('be.visible')
          .find('.Select__option')
          .contains(`${firstUser.firstName} ${firstUser.lastName}`)
          .click();
      });

      submitUserForm();
    });

    /**
     * ** Création du membre "Prescripteur"
     */
    it("J'ajoute un nouveau membre - Referer", () => {
      // Insertion des informations de base d'un utilisateur
      fillUserForm('Prescripteur');

      // Assertion - vérifications que le champs organizationId est affiché
      cy.get('#form-add-user-organizationId').should('be.visible');

      // Chargement du fichier de fixture organizations.json contenant les organizations
      cy.fixture('api/generated/organizations').then((organizations) => {
        const firstOrganization = organizations[0];

        cy.get('#form-add-user-organizationId')
          .should('be.visible')
          .type(firstOrganization.name);

        cy.get('#form-add-user-organizationId')
          .find('.Select__menu')
          .should('be.visible')
          .find('.Select__option')
          .contains(firstOrganization.name)
          .click();
      });

      submitUserForm();
    });
  });

  /**
   * Je parcours les organisations
   */
  describe('Je parcours les organisations', () => {
    beforeEach(() => {
      cy.visit('/backoffice/admin/structures');
    });

    /**
     * Première partie de test - J'affiche les organisations
     */
    it("J'affiche les organisations", () => {
      // Grâce au fichier de fixture précédement généré
      cy.fixture('api/generated/organizations').then((organizations) => {
        // ...je peux tester si j'obtiens, dans l'interface, le bon nombre d'organisations
        cy.get('[data-testid="organization-list"]')
          .find('tr')
          .its('length')
          .should('eq', organizations.length);
      });
    });

    /**
     * Deuxième partie de test - Je créer une organisation
     */
    it("J'ajoute une nouvelle organisation", () => {
      // Créer une organisation
      cy.get('[data-testid="button-admin-create"]')
        .should('be.visible')
        .first()
        .click();

      cy.get('[data-testid="button-create-organization"]')
        .should('be.visible')
        .first()
        .click();

      cy.get('.ReactModalPortal div').first().should('be.visible');

      cy.get('#form-add-organization-name')
        .should('be.visible')
        .type('Entourage');

      cy.get('#form-add-organization-address')
        .should('be.visible')
        .type('174 rue Championnet, 75015 Paris');

      cy.get('#form-add-organization-zone-container button')
        .should('be.visible')
        .click();
      cy.get('#form-add-organization-zone-container')
        .find('.option')
        .contains('Paris')
        .click();

      cy.get('#form-add-organization-referentFirstName')
        .should('be.visible')
        .type('John');

      cy.get('#form-add-organization-referentLastName')
        .should('be.visible')
        .type('Doe');

      cy.get('#form-add-organization-referentPhone')
        .should('be.visible')
        .type('0698754321');

      cy.get('#form-add-organization-referentMail')
        .should('be.visible')
        .type('johndoe@gmail.com');

      cy.get('button')
        .contains('Créer la structure')
        .should('be.visible')
        .click();

      cy.wait('@postOrganization');

      cy.get('.ReactModalPortal div').should('not.exist');
    });

    /**
     * Troisieme partie de test - J'edite une organisation
     */
    it("J'édite une organization existante", () => {
      // Grâce au fichier de fixture précédement généré
      cy.fixture('api/generated/organizations').then((organizations) => {
        // Open the form with the first organization button edit
        cy.get(
          `[data-testid="button-edit-organization-${organizations[0].id}"]`
        )
          .as(`organization-id`)
          .should('be.visible')
          .first();
        cy.get(`@organization-id`).first().click();

        // Wait modale to be visible
        cy.get('.ReactModalPortal div').first().should('be.visible');

        // Edition de chaque valeur du formulaire
        cy.get('#form-add-organization-name')
          .should('be.visible')
          .clear()
          .type('Entourage Pro');

        cy.get('#form-add-organization-address')
          .should('be.visible')
          .clear()
          .type('15 Avenue Lacassagne, 69003 Lyon');

        cy.get('#form-add-organization-zone-container button')
          .should('be.visible')
          .click();
        cy.get('#form-add-organization-zone-container')
          .find('.option')
          .contains('Lyon')
          .click();

        cy.get('#form-add-organization-referentFirstName')
          .should('be.visible')
          .clear()
          .type('Jane');

        cy.get('#form-add-organization-referentLastName')
          .should('be.visible')
          .clear()
          .type('Fonda');

        cy.get('#form-add-organization-referentPhone')
          .should('be.visible')
          .clear()
          .type('+330666059439');

        cy.get('#form-add-organization-referentMail')
          .should('be.visible')
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
});
