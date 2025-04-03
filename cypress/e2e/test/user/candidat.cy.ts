import moment from 'moment';
import bootstrap from '../bootstrap';

describe('Candidat', () => {
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
      fixture: 'auth-current-candidat-onboarding3-res',
    }).as('authCheck');

    // to be done: use automatic generation and not static data
    cy.fixture('auth-current-candidat-onboarding3-res').then((user) => {
      cy.intercept('GET', `/cv/${user.id}`, {
        fixture: 'api/generated/cv-candidate',
      }).as('cvCandidat');

      cy.intercept('POST', `/cv/${user.id}`, {
        fixture: 'api/generated/cv-candidate',
      }).as('postCvCandidat');

      // to be done: use automatic generation and not static data
      cy.intercept('GET', `/user/${user.id}`, {
        fixture: 'auth-current-candidat-onboarding3-res',
      });

      cy.intercept('GET', `/cv/read/${user.id}`, {
        fixture: 'api/cv-read-res',
      }).as('cvCandidatDetails');

      cy.intercept('PUT', `/cv/read/${user.id}`, {
        fixture: 'api/cv-read-res',
      }).as('putCVCandidat');

      cy.intercept('PUT', `/user/candidate/${user.id}`, {
        ...user,
        candidat: { ...user.candidat, hidden: true },
      }).as('putUserCandidatParams');

      // cy.intercept('PUT', `/user/${user.id}`, {
      //   fixture: 'put-candidate-res',
      // }).as('putUserParams');

      cy.intercept('GET', `/cv/lastVersion/${user.id}`, {
        fixture: 'api/generated/cv-candidate',
      });

      cy.intercept('GET', `/user/candidate/checkUpdate/${user.id}`, {
        noteHasBeenModified: true,
      }).as('candidatCheckUpdate');

      cy.intercept('GET', `/cv/checkUpdate/${user.id}`, {
        cvHasBeenModified: true,
      }).as('cvCheckUpdate');

      cy.intercept(
        'POST',
        `/user/profile/uploadImage/${user.id}`,
        '/assets/image-fixture.jpg'
      ).as('uploadImage');
    });

    cy.intercept('GET', `https://tarteaucitron.io/load.js*`, {});

    cy.intercept('PUT', '/user/changePwd', {}).as('changePwd');

    cy.intercept('GET', '/user/profile/*', {
      fixture: 'public-profile-res',
    }).as('getUserProfile');

    cy.intercept('/message/internal', {}).as('postInternalMessage');
  });

  it('should open backoffice cv candidat', () => {
    // to be done: use automatic generation and not static data
    cy.fixture('auth-current-candidat-onboarding3-res').then((user) => {
      cy.visit(`/backoffice/candidat/${user.id}/cv`);
      cy.url().should('include', user.id);
    });
    // catchphrase
    cy.get(`[data-testid="cv-catchphrase-button-edit"]`)
      .scrollIntoView()
      .click();
    const catchPhrase = 'hello my name is Mike';
    cy.get('#form-catchphrase-catchphrase').clear().type(catchPhrase);
    cy.get(`[data-testid="form-confirm-form-catchphrase"]`).click();
    cy.get(`[data-testid="cv-edit-catchphrase-content"]`).should(
      'contain',
      catchPhrase
    );

    // presentation
    cy.get(`[data-testid="cv-story-button-edit"]`).scrollIntoView().click();
    const story = 'Here I present';
    cy.get('#form-story').clear().type(story);
    cy.get(`[data-testid="form-confirm-form-story"]`).click();
    cy.get(`[data-testid="cv-edit-story-content"]`).should('contain', story);

    // atouts/skills
    cy.get(`[data-testid="cv-skills-button-edit"]`).scrollIntoView().click();
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

    // formations
    cy.get(`[data-testid="cv-formations-button-edit"]`)
      .scrollIntoView()
      .click();
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

    // experience
    cy.get(`[data-testid="cv-experiences-button-edit"]`)
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
    // save experience
    cy.get(`[data-testid="form-confirm-form-experience"]`)
      .scrollIntoView()
      .click();

    // save CV
    cy.contains('Sauvegarder').scrollIntoView().click();
  });

  it('should open backoffice candidate parameters', () => {
    cy.visit('/backoffice/parametres');

    // toggle hide CV
    cy.get('label[for="ent-toggle-hidden"]').click();
    cy.get(`[data-testid="test-confirm-hidden"]`).click();
    cy.wait('@putUserCandidatParams');
    cy.get(`[data-testid="test-toggle-hidden"]`).should('be.checked');
    cy.get('label[for="ent-toggle-hidden"]').click();
    cy.get(`[data-testid="test-toggle-hidden"]`).should('not.be.checked');

    // toggle is employed
    cy.get('label[for="ent-toggle-employedToggle"]').scrollIntoView().click();

    cy.get('#form-edit-employed-contract-container button')
      .should('be.visible')
      .scrollIntoView()
      .click();
    cy.get('#form-edit-employed-contract-container')
      .find('.option')
      .contains('Alternance')
      .click();
    cy.get('#form-edit-employed-endOfContract').type(
      moment().add(1, 'month').format('YYYY-MM-DD')
    );
    cy.contains('Sauvegarder').click();
    cy.wait('@putUserCandidatParams');
    cy.get(`[data-testid="test-toggle-employedToggle"]`).should('be.checked');
    cy.get('label[for="ent-toggle-employedToggle"]').click();
    cy.get(`[data-testid="test-toggle-employedToggle"]`).should(
      'not.be.checked'
    );

    // change password
    cy.get('#form-change-pwd-oldPassword').type('blablabla');
    cy.get('#form-change-pwd-newPassword').type('Linkedout123!');
    cy.get('#form-change-pwd-confirmPassword').type('Linkedout123!');
    cy.get('[data-testid="form-confirm-form-change-pwd"]').click();
    cy.wait('@changePwd');

    // to be done with automatic generation
    const newHelpList = [
      {
        id: '352a7dde-c4ad-410f-86cf-506cdc9eb624',
        name: 'cv',
      },
      {
        id: '352a7dde-c4ad-410f-86cf-506cdc9eb624',
        name: 'tips',
      },
    ];
    // to be done: use automatic generation and not static data
    cy.fixture('auth-current-candidat-onboarding3-res').then((user) => {
      // check help needs and modify
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        ...user,
        userProfile: {
          ...user.userProfile,
          helpNeeds: newHelpList,
        },
        // fixture: 'user-profile-candidate-help-modified',
      }).as('putUserProfile');
    });
    // to be done: use automatic generation and not static data
    cy.fixture('auth-current-candidat-onboarding3-res').then((user) => {
      cy.get(`[data-testid="parametres-help-list"]`)
        .scrollIntoView()
        .find('li')
        .should('have.length', user.userProfile?.helpNeeds?.length);
    });
    cy.get(`[data-testid="parametres-help-card-button-edit"]`)
      .scrollIntoView()
      .click();
    // remove existing
    cy.get(`[data-testid="form-edit-helps-helps-interview"]`)
      .scrollIntoView()
      .click();
    // ad new one
    cy.get(`[data-testid="form-edit-helps-helps-tips"]`)
      .scrollIntoView()
      .click();
    // add second one
    cy.get(`[data-testid="form-edit-helps-helps-cv"]`).scrollIntoView().click();
    cy.get(`[data-testid="form-confirm-form-edit-helps"]`)
      .scrollIntoView()
      .click();

    // cy.fixture('user-profile-candidate-help-modified').then((userProfile) => {
    cy.get(`[data-testid="parametres-help-list"]`)
      .scrollIntoView()
      .find('li')
      .should('have.length', newHelpList.length);
    // });

    // modify profile description
    const description = 'hello sir';
    // to be done: use automatic generation and not static data
    cy.fixture('auth-current-candidat-onboarding3-res').then((user) => {
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        ...user,
        userProfile: {
          ...user.userProfile,
          description,
          helpNeeds: newHelpList,
        },
      }).as('putUserProfile');
    });
    cy.get(`[data-testid="profile-description-modify-button"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="form-profile-description-description"]`)
      .scrollIntoView()
      .type(description);
    cy.get(`[data-testid="form-confirm-form-profile-description"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="profile-description"]`).should(
      'contain',
      description
    );

    // change profile picture
    cy.get(`[data-testid="profile-picture-upload-desktop"]`).selectFile(
      'assets/image-fixture.jpg',
      { force: true }
    );
    cy.wait('@uploadImage');

    // change professional information
    const businessSector = 'Agriculture';
    const occupation = 'test';
    // to be done: use automatic generation and not static data
    cy.fixture('auth-current-candidat-onboarding3-res').then((user) => {
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        ...user,
        userProfile: {
          ...user.userProfile,
          description,
          helpNeeds: newHelpList,
          businessSectors: [
            {
              id: '8c08d1d2-9cb4-4a93-afd3-4bdaaf039093',
              name: 'aev',
              order: 0,
              UserProfileBusinessSector: {
                id: '54c6389c-ab98-4d02-84cc-e651164db9f7',
              },
            },
          ],
          occupations: [
            {
              id: 'd4d31f0d-3036-47f1-b3a3-cde0c1d0ec8b',
              name: occupation,
              prefix: 'comme',
              order: 0,
              UserProfileOccupation: {
                id: '77f613bc-a2af-405a-ab5c-c9bc470b8f77',
              },
            },
          ],
        },
      }).as('putUserProfile');
    });
    cy.get(
      `[data-testid="parametres-professional-information-card-button-edit"]`
    )
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="form-career-path-businessSector0"]`)
      .scrollIntoView()
      .click();
    cy.get(`.Select__option`).contains(businessSector).click();
    cy.get(`[data-testid="form-career-path-occupation0"]`)
      .scrollIntoView()
      .type(occupation);
    cy.get(`[data-testid="form-confirm-form-career-path"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="candidat-businesssector-li"]`).should(
      'contain',
      businessSector
    );
    cy.get(`[data-testid="candidat-occupation-li"]`).should(
      'contain',
      occupation
    );
  });
});
