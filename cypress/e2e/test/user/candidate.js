/* eslint-disable no-undef */
import bootstrap from '../bootstrap.js';
import { candidateRequests } from './intercept/user/candidate.req.js';

/**
 * Traitement Candidat
 */
describe('Traitement candidat (en tant que Coach)', () => {
  /**
   * Nous générons toutes les fixtures
   */
  bootstrap();

  /**
   * À chaque fois:
   * - interceptions de multiple requêtes API (GET, POST, PUT)
   */
  beforeEach(() => {
    cy.intercept('GET', '/auth/current', {
      fixture: 'api/candidate-login',
    }).as('authCheck');

    // Necessite le fichier candidate-login.json pour y récupérer datas.
    cy.fixture('api/candidate-login').then((user) => {
      /**
       * Intercept GET requests
       */
      candidateRequests(user).GET.map((request) => {
        if (request.alias)
          cy.intercept('GET', request.path, request.data).as(request.alias);
        else cy.intercept('GET', request.path, request.data);
      });
      /**
       * Intercept POST requests
       */
      candidateRequests(user).POST.map((request) => {
        if (request.alias)
          cy.intercept('POST', request.path, request.data).as(request.alias);
        else cy.intercept('POST', request.path, request.data);
      });
      /**
       * Intercept PUT requests
       */
      candidateRequests(user).PUT.map((request) => {
        if (request.alias)
          cy.intercept('PUT', request.path, request.data).as(request.alias);
        else cy.intercept('PUT', request.path, request.data);
      });

      // Nous utilisons la fixture suivante pour récupérer des informations
      cy.fixture('api/opportunities-wrapped').then((offersRes) => {
        cy.intercept(
          `opportunity/${offersRes.offers[0].id}`,
          offersRes.offers[0]
        ).as('getOneOffer');

        // Nous récupérons la premiere offre (opportunité)
        const opportunityToModify = offersRes.offers[0];
        opportunityToModify.bookmarked = false;

        cy.intercept(
          'PUT',
          `opportunity/join/${offersRes.offers[0].id}/${user.id}`,
          opportunityToModify
        ).as('putOffer');
      });

      cy.intercept(
        'POST',
        `/user/profile/uploadImage/${user.id}`,
        '/assets/image-fixture.jpg'
      ).as('uploadImage');
    });
  });

  /**
   * Je parcours les offres
   */
  it("Nous accédons aux offres publiques (BO) de l'utilisateur", () => {
    cy.fixture('api/candidate-login').then((user) => {
      cy.visit(`/backoffice/candidat/${user.id}/offres/public`, {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('access-token', '0x1x2x3x4');
          window.localStorage.setItem('release-version', 'v100');
        },
      });

      cy.url().should('include', user.id);
    });

    // Vérif. si la liste est complète
    cy.get('[data-testid="candidat-offer-list-container"]', { timeout: 20000 })
      .find('> div')
      .should('have.length', 16);

    // Vérif. si la bonne opportunité est affichée
    cy.fixture('api/opportunities-wrapped').then((offersList) => {
      cy.url().should('include', offersList.offers[0].id);

      cy.get('[data-testid="candidat-offer-details-title"]').contains(
        offersList.offers[0].title
      );
    });

    // Bookmark/unbookmark une opportunité de la liste
    cy.fixture('api/opportunities-wrapped').then((offersRes) => {
      const { bookmarked } = offersRes.offers[0].opportunityUsers;

      const cta1 = bookmarked ? 'cta-unbookmark' : 'cta-bookmark';
      const cta2 = !bookmarked ? 'cta-unbookmark' : 'cta-bookmark';

      cy.get(`[data-testid="${cta1}"]`)
        .first()
        .should(bookmarked ? 'contain' : 'not.contain', 'Favoris');
      cy.get(`[data-testid="${cta1}"]`).first().click();
      cy.wait('@putOffer');
      cy.get(`[data-testid="${cta2}"]`)
        .first()
        .should(!bookmarked ? 'contain' : 'not.contain', 'Favoris');
    });
  });

  /**
   * Je parcours les offres privées
   */
  it('Nous accédons aux offres privées (BO) - et ajoutons une offre', () => {
    cy.fixture('api/candidate-login').then((user) => {
      cy.visit(`/backoffice/candidat/${user.id}/offres/private`, {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('access-token', '0x1x2x3x4');
          window.localStorage.setItem('release-version', 'v100');
        },
      });
      cy.url().should('include', user.id);
    });
    // check if the right opportunity is open
    cy.fixture('api/opportunities-wrapped').then((offersList) => {
      cy.url().should('include', offersList.offers[0].id);
      cy.get('[data-testid="candidat-offer-details-title"]').contains(
        offersList.offers[0].title
      );
    });
    cy.get('[data-testid="candidat-add-offer-main"]').click();
    cy.get('#form-add-offer-external-title').scrollIntoView().type('test');
    cy.get('#form-add-offer-external-company').scrollIntoView().type('test');

    cy.get('#form-add-offer-external-department')
      .should('be.visible')
      .scrollIntoView()
      .type('Par');

    cy.get('#form-add-offer-external-department')
      .find('.Select__menu')
      .should('be.visible')
      .scrollIntoView()
      .find('.Select__option')
      .contains('Paris (75)')
      .click();

    cy.get('#form-add-offer-external-contract-container')
      .should('be.visible')
      .scrollIntoView()
      .click()
      .find('.option')
      .contains('CDI')
      .click();

    cy.get('#form-add-offer-external-recruiterFirstName')
      .scrollIntoView()
      .type('test');
    cy.get('#form-add-offer-external-recruiterName')
      .scrollIntoView()
      .type('test');
    cy.get('#form-add-offer-external-recruiterMail')
      .scrollIntoView()
      .type('test@gmail.com');
    cy.get('#form-add-offer-external-description')
      .scrollIntoView()
      .type('test');
    cy.get('#form-add-offer-external-link').scrollIntoView().type('test');
    cy.get('button').contains('Envoyer').click();
    cy.wait('@postExternal');

    // La modal s'est fermée
    cy.get('.uk-modal-body').should('not.exist');
  });

  /**
   * Je parcours le CV
   */
  it("J'affiche le CV du candidat", () => {
    cy.visit(`/backoffice/candidat/${user.id}/cv`, {
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('access-token', '0x1x2x3x4');
        window.localStorage.setItem('release-version', 'v100');
      },
    });

    cy.url().should('include', user.id);

    // Catchphrase
    cy.get(`[data-testid="test-catchphrase-edit-icon"]`)
      .scrollIntoView()
      .click();

    const catchPhrase = 'hello my name is Mike';

    cy.get('#form-catchphrase-catchphrase').clear().type(catchPhrase);
    cy.get(`[data-testid="form-confirm-form-catchphrase"]`).click();
    cy.get(`[data-testid="cv-edit-catchphrase-content"]`).should(
      'contain',
      catchPhrase
    );

    // Presentation
    cy.get(`[data-testid="test-story-edit-icon"]`).scrollIntoView().click();
    const story = 'Here I present';
    cy.get('#form-story').clear().type(story);
    cy.get(`[data-testid="form-confirm-form-story"]`).click();
    cy.get(`[data-testid="cv-edit-story-content"]`).should('contain', story);

    // Atouts/Compétences
    cy.get(`[data-testid="test-skills-edit-icon"]`).scrollIntoView().click();
    const skill1 = 'skill1';
    const skill2 = 'skill2';
    cy.get('#form-skills')
      .find('#form-skills-skills')
      .find(`.Select__clear-indicator`)
      .should('be.visible')
      .click();
    cy.get('#form-skills')
      .find('#form-skills-skills')
      .click()
      .type(`${skill1}{enter}`);
    cy.get('#form-skills')
      .find('#form-skills-skills')
      .click()
      .type(`${skill2}{enter}`);
    cy.get(`[data-testid="form-confirm-form-skills"]`).click();
    cy.get(`[data-testid="cv-edit-skill1-content"]`).should('contain', skill1);
    cy.get(`[data-testid="cv-edit-skill2-content"]`).should('contain', skill2);

    // Formations
    cy.get(`[data-testid="button-cv-add-formations"]`).scrollIntoView().click();
    cy.get(`[data-testid="form-formation-title"]`)
      .scrollIntoView()
      .type('formation title');
    cy.get('#form-formation-description')
      .scrollIntoView()
      .type('formation description');
    cy.get(`[data-testid="form-formation-location"]`)
      .scrollIntoView()
      .type('formation location');
    cy.get(`[data-testid="form-formation-institution"]`)
      .scrollIntoView()
      .type('institution');
    cy.get(`[data-testid="form-formation-dateStart"]`)
      .scrollIntoView()
      .type('1994-02-02');
    cy.get(`[data-testid="form-formation-dateEnd"]`)
      .scrollIntoView()
      .type('1995-02-02');

    // save formation
    cy.get(`[data-testid="form-confirm-form-formation"]`)
      .scrollIntoView()
      .click();

    // Experiences
    cy.get(`[data-testid="button-cv-add-experiences"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="form-experience-title"]`)
      .scrollIntoView()
      .type('experience title');
    cy.get('#form-experience-description')
      .scrollIntoView()
      .type('experience description');
    cy.get(`[data-testid="form-experience-location"]`)
      .scrollIntoView()
      .type('experience location');
    cy.get(`[data-testid="form-experience-company"]`)
      .scrollIntoView()
      .type('experience company');
    cy.get(`[data-testid="form-experience-dateStart"]`)
      .scrollIntoView()
      .type('1994-02-02');
    cy.get(`[data-testid="form-experience-dateEnd"]`)
      .scrollIntoView()
      .type('1995-02-02');

    // Sauvegarde les experiences
    cy.get(`[data-testid="form-confirm-form-experience"]`)
      .scrollIntoView()
      .click();

    // Sauvegarde le CV
    cy.contains('Sauvegarder').scrollIntoView().click();
  });

  /**
   * Je parcours les paramètres
   */
  it("J'affiche les paramètres du candidat", () => {
    cy.visit('/backoffice/parametres', {
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('access-token', '1234');
        window.localStorage.setItem('release-version', 'v100');
      },
    });

    // Toggle CV
    cy.get('label[for="ent-toggle-hidden"]').click();
    cy.get(`[data-testid="test-confirm-hidden"]`).click();
    cy.wait('@putUserCandidatParams');
    cy.get(`[data-testid="test-toggle-hidden"]`).should('be.checked');
    cy.get('label[for="ent-toggle-hidden"]').click();
    cy.get(`[data-testid="test-toggle-hidden"]`).should('not.be.checked');

    // Toggle employed
    cy.get('label[for="ent-toggle-employedToggle"]').click();

    cy.get('#form-edit-employed-contract-container')
      .should('be.visible')
      .scrollIntoView()
      .click()
      .find('.option')
      .contains('Alternance')
      .click();

    cy.get('#form-edit-employed-endOfContract').type('2024-03-03');
    cy.contains('Sauvegarder').click();
    cy.wait('@putUserCandidatParams');
    cy.get(`[data-testid="test-toggle-employedToggle"]`).should('be.checked');
    cy.get('label[for="ent-toggle-employedToggle"]').click();
    cy.get(`[data-testid="test-toggle-employedToggle"]`).should(
      'not.be.checked'
    );

    // Change password
    cy.get('#form-change-pwd-oldPassword').type('blablabla');
    cy.get('#form-change-pwd-newPassword').type('Linkedout123!');
    cy.get('#form-change-pwd-confirmPassword').type('Linkedout123!');
    cy.get('[data-testid="form-confirm-form-change-pwd"]').click();
    cy.wait('@changePwd');

    // Check help needs and modify
    cy.fixture('api/candidate-login').then((user) => {
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        fixture: 'user-profile-candidate-help-modified',
      }).as('putUserProfile');
    });

    cy.fixture('api/candidate-login').then((userCandidate) => {
      cy.get(`[data-testid="parametres-help-list"]`)
        .scrollIntoView()
        .find('li')
        .should('have.length', userCandidate.userProfile?.helpNeeds?.length);
    });

    cy.get(`[data-testid="parametres-help-card-button-edit"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="parametres-help-option-tips"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="parametres-help-option-cv"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="parametres-help-modal-save"]`)
      .scrollIntoView()
      .click();

    // cy.fixture('user-profile-candidate-help-modified').then((userProfile) => {
    //   cy.get(`[data-testid="parametres-help-list"]`)
    //     .scrollIntoView()
    //     .find('li')
    //     .should('have.length', userProfile.helpNeeds?.length);
    // });

    // modify profile description
    // cy.fixture('api/candidate-login').then((user) => {
    //   cy.intercept('PUT', `/user/profile/${user.id}`, {
    //     fixture: 'user-profile-candidate-description-modified',
    //   }).as('putUserProfile');
    // });

    cy.get(`[data-testid="parametres-description-placeholder"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="form-profile-description-description"]`)
      .scrollIntoView()
      .type('hello');
    cy.get(`[data-testid="form-confirm-form-profile-description"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="parametres-description"]`).should('contain', 'hello');

    // Change profile picture
    cy.get(`[data-testid="profile-picture-upload-desktop"]`).selectFile(
      'assets/image-fixture.jpg',
      { force: true }
    );
    cy.wait('@uploadImage');

    // Change professional information
    // cy.fixture('api/candidate-login').then((user) => {
    //   cy.intercept('PUT', `/user/profile/${user.id}`, {
    //     fixture: 'user-profile-candidate-professional-info-modified',
    //   }).as('putUserProfile');
    // });
    const businessLine = 'Agriculture';
    const ambition = 'Test';

    cy.get(
      `[data-testid="parametres-professional-information-card-button-edit"]`
    )
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="form-career-path-searchBusinessLine0"]`)
      .scrollIntoView()
      .click();
    cy.get(`.Select__option`).contains(businessLine).click();
    cy.get(`[data-testid="form-career-path-searchAmbition0"]`)
      .scrollIntoView()
      .type(ambition);
    cy.get(`[data-testid="form-confirm-form-career-path"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="candidat-businessline-li"]`).should(
      'contain',
      businessLine
    );
    cy.get(`[data-testid="candidat-ambition-li"]`).should('contain', ambition);
  });
});
