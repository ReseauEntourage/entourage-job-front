import bootstrap from '../bootstrap';
import { adminRequests } from '../../intercept/user/admin.req';

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
    /**
     * Intercept GET requests
     */
    adminRequests.GET.map((request) => {
      if (request.alias)
        cy.intercept('GET', request.path, request.data).as(request.alias);
      else cy.intercept('GET', request.path, request.data);
    });
    /**
     * Intercept POST requests
     */
    adminRequests.POST.map((request) => {
      if (request.alias)
        cy.intercept('POST', request.path, request.data).as(request.alias);
      else cy.intercept('POST', request.path, request.data);
    });
    /**
     * Intercept PUT requests
     */
    adminRequests.PUT.map((request) => {
      if (request.alias)
        cy.intercept('PUT', request.path, request.data).as(request.alias);
      else cy.intercept('PUT', request.path, request.data);
    });
  });

  /**
   * Je parcours les opportunités
   */
  describe('Je parcours les opportunités', () => {
    /**
     * Première partie de test - J'affiche les opport.
     */
    it("J'affiche les opportunités", () => {
      // Accèdons à l'URL des opportunités
      cy.visit('/backoffice/admin/offres', {
        // J'ajoute un fake token dans mon localStorage pour simuler l'authentification
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('access-token', '0x1x2x3x4');
          window.localStorage.setItem('release-version', 'v100');
        },
      });
      cy.wait('@opportunities');
      // Grâce au fichier de fixture précédement généré
      cy.fixture('api/opportunities').then((opportunities) => {
        // ...je peux tester si j'obtiens, dans l'interface, le bon nombre d'opportunités
        cy.get('[data-testid="admin-offer-list-element"]')
          .its('length')
          .should('eq', opportunities.length);
        // Ensuite je récupère la première opportunité (depuis la fixture)
        const firstOpportunity = opportunities[0];
        // J'intercepte la requête API qui contient l'ID de la première opportunité
        cy.intercept(
          'GET',
          `opportunity/${firstOpportunity.id}`,
          firstOpportunity
        ).as('opportunity');
        // Nous patientons la reponse (traitement fixture)
        cy.wait('@opportunity');
        // Nous vérifions aussi que l'URL est constitué de l'ID de la première opportunités
        cy.url().should('include', firstOpportunity.id);
        // Nous changeons d'onglets
        cy.get('[data-testid="admin-offer-tab-validated"]').click();
        cy.url().should('include', 'validated');
        cy.get('[data-testid="admin-offer-tab-external"]').click();
        cy.url().should('include', 'external');
        cy.get('[data-testid="admin-offer-tab-archived"]').click();
        cy.url().should('include', 'archived');
      });
    });

    /**
     * Deuxième partie de test - Je créer une opportunité
     */
    it("J'ajoute une nouvelle opportunité", () => {
      // Remplissage du formulaire d'une opportunité
      cy.get('[data-testid="button-admin-create"]').click();
      cy.get('[data-testid="admin-add-offer-main"]').click();
      cy.get('#form-add-offer-admin-title').type('test');
      cy.get('#form-add-offer-admin-company').type('test');

      cy.get('#form-add-offer-admin-department')
        .should('be.visible')
        .type('Par');

      cy.get('#form-add-offer-admin-department')
        .find('.Select__menu')
        .should('be.visible')
        .find('.Select__option')
        .contains('Paris (75)')
        .click();

      cy.get('#form-add-offer-admin-address')
        .should('be.visible')
        .type('description');

      cy.get('#form-add-offer-admin-companyDescription')
        .should('be.visible')
        .type('description');

      cy.get('#form-add-offer-admin-contract-container')
        .scrollIntoView()
        .should('be.visible')
        .click()
        .find('.option')
        .contains('CDI')
        .click();

      cy.get('#form-add-offer-admin-recruiterFirstName').type('test');
      cy.get('#form-add-offer-admin-recruiterName').type('test');
      cy.get('#form-add-offer-admin-recruiterPosition').type('test');
      cy.get('#form-add-offer-admin-recruiterMail').type('test@gmail.com');
      cy.get('#form-add-offer-admin-businessLines')
        .should('be.visible')
        .type('Agr');

      cy.get('#form-add-offer-admin-businessLines')
        .find('.Select__menu')
        .should('be.visible')
        .find('.Select__option')
        .contains('Agriculture et espaces verts')
        .click();

      cy.get('#form-add-offer-admin-description').scrollIntoView().type('test');
      cy.get('button').contains('Valider').click();

      cy.wait('@postOpportunity');
    });
  });

  /**
   * Je parcours les membres
   */
  describe('Je parcours les membres', () => {
    /**
     * Première partie de test - J'affiche les membres.
     */
    it("J'affiche les membres", () => {
      // Accèdons à l'URL des membres
      cy.visit('/backoffice/admin/membres?role=Candidat', {
        // J'ajoute un fake token dans mon localStorage pour simuler l'authentification
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('access-token', '0x1x2x3x4');
          window.localStorage.setItem('release-version', 'v100');
        },
      });

      // Grâce au fichier de fixture précédement généré
      cy.fixture('api/users-candidat').then((candidates) => {
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

      cy.get('#form-add-user-gender-container')
        .should('be.visible')
        .click()
        .get('button')
        .contains('Homme')
        .click();

      cy.get('#form-add-user-zone-container')
        .should('be.visible')
        .click()
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

      cy.get('#form-add-user-adminRole-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Candidats')
        .click();

      cy.get('button').contains('Ajouter').should('be.visible').click();

      cy.wait('@postCandidate');

      cy.get('.ReactModalPortal div').should('not.exist');
    });

    /**
     * ** Création du nouveau membre "candidat lko"
     * ** à savoir - "coach lko" est exactement pareil (inutile de tester)
     */
    it("J'ajoute un nouveau membre - Candidat/Coach LKO", () => {
      // Insertion des informations de base d'un utilisateur - role Candidat LKO
      fillUserForm('Candidat LKO');

      // Assertion - vérifications que les champs ci-dessous ne sont pas affichés à cet instant
      cy.get('#form-add-user-organizationId').should('not.exist');
      cy.get('#form-add-user-adminRole-container').should('not.exist');
      cy.get('[id$=Organization]').should('not.exist');

      // Chargement du fichier de fixture search-user.json - inutile de se soucier du type (non utile)
      cy.fixture('api/search-user').then((users) => {
        let firstUser = users[0];

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
     * ** Création du membre "coach externe"
     * ** à savoir - "candidat externe" est exactement pareil (inutile de tester)
     */
    it("J'ajoute un nouveau membre - Candidat/Coach externe", () => {
      // Insertion des informations de base d'un utilisateur
      fillUserForm('Coach externe');

      // Assertion - vérifications que les champs ci-dessous ne sont pas affichés à cet instant
      cy.get('#form-add-user-adminRole-container').should('not.exist');
      cy.get('#form-add-user-userToLinkId').should('not.exist');

      // Chargement du fichier de fixture organizations.json contenant les organizations
      cy.fixture('api/organizations').then((organizations) => {
        let firstOrganization = organizations[0];

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

      // Puis chargement du fichier de fixture organizations.json contenant les organizations
      cy.fixture('api/search-user').then((users) => {
        let firstUser = users[0];

        cy.get('#form-add-user-userToLinkId')
          .should('be.visible')
          .type(firstUser.firstName);

        cy.get('#form-add-user-userToLinkId')
          .find('.Select__menu')
          .should('be.visible')
          .find('.Select__option')
          .contains(`${firstUser.firstName} ${firstUser.lastName}`)
          .click();
      });

      submitUserForm();
    });
  });

  /**
   * Je parcours les organisations
   */
  describe('Je parcours les organisations', () => {
    /**
     * Première partie de test - J'affiche les organisations
     */
    it("J'affiche les organisations", () => {
      // Accèdons à l'URL des organisations
      cy.visit('/backoffice/admin/structures', {
        // J'ajoute un fake token dans mon localStorage pour simuler l'authentification
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('access-token', '0x1x2x3x4');
          window.localStorage.setItem('release-version', 'v100');
        },
      });
      // Grâce au fichier de fixture précédement généré
      cy.fixture('api/organizations').then((organizations) => {
        // ...je peux tester si j'obtiens, dans l'interface, le bon nombre d'opportunités
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

      cy.get('#form-add-organization-zone-container')
        .should('be.visible')
        .click()
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
      let firstOrganization;
      // Grâce au fichier de fixture précédement généré
      cy.fixture('api/organizations').then((organizations) => {
        //    Ensuite je récupère la première opportunité (depuis la fixture)
        firstOrganization = organizations[0];
        // Edition de chaque valeur du formulaire
        cy.get(
          `[data-testid="button-edit-organization-${firstOrganization.id}"]`
        )
          .should('be.visible')
          .first()
          .click();
      });

      cy.get('.ReactModalPortal div').first().should('be.visible');

      cy.get('#form-add-organization-name')
        .should('be.visible')
        .clear()
        .type('Entourage Pro');

      cy.get('#form-add-organization-address')
        .should('be.visible')
        .clear()
        .type('15 Avenue Lacassagne, 69003 Lyon');

      cy.get('#form-add-organization-zone-container')
        .should('be.visible')
        .click()
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
