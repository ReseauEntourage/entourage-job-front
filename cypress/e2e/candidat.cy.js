/* eslint-disable no-undef */
import moment from 'moment';

describe('Candidat', () => {
  beforeEach(() => {
    cy.intercept('GET', '/cv/shares', { total: 184221 }).as('cvShares');

    cy.intercept('GET', '/auth/current', {
      fixture: 'auth-current-candidat-res',
    }).as('authCheck');

    cy.fixture('auth-current-candidat-res').then((user) => {
      cy.intercept('GET', `/opportunity/candidate/count/${user.id}`, {
        unseenOpportunities: 0,
      }).as('userCount');

      cy.intercept('GET', `/cv/${user.id}`, {
        fixture: 'cv-for-candidat',
      }).as('cvCandidat');

      cy.intercept('POST', `/cv/${user.id}`, {
        fixture: 'cv-for-candidat',
      }).as('postCvCandidat');

      cy.intercept('GET', `/opportunity/candidate/all/${user.id}*`, {
        fixture: 'user-opportunity-all-res',
      }).as('allOpportunities');

      cy.intercept('GET', `opportunity/candidate/tabCount/${user.id}`, {
        fixture: 'tabCount-res',
      }).as('tabCount');

      cy.intercept('GET', `/cv/read/${user.id}`, {
        fixture: 'cv-read-res',
      }).as('cvCandidatDetails');

      cy.intercept('GET', `/user/${user.id}`, {
        fixture: 'auth-current-candidat-res',
      });

      cy.intercept('PUT', `/cv/read/${user.id}`, {
        fixture: 'cv-read-res',
      }).as('putCVCandidat');

      cy.intercept('PUT', `/user/candidate/${user.id}`, {
        fixture: 'put-candidate-res',
      }).as('putUserCandidatParams');

      cy.intercept('PUT', `/user/${user.id}`, {
        fixture: 'put-candidate-res',
      }).as('putUserParams');

      cy.intercept('GET', `/cv/lastVersion/${user.id}`, {
        fixture: 'cv-for-candidat',
      });

      cy.intercept('GET', `/user/candidate/checkUpdate/${user.id}`, {
        noteHasBeenModified: true,
      }).as('candidatCheckUpdate');

      cy.intercept('GET', `/cv/checkUpdate/${user.id}`, {
        cvHasBeenModified: true,
      }).as('cvCheckUpdate');

      cy.fixture('user-opportunity-all-res').then((offersRes) => {
        cy.intercept(
          `opportunity/${offersRes.offers[0].id}`,
          offersRes.offers[0]
        ).as('getOneOffer');
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

    cy.intercept('GET', `https://tarteaucitron.io/load.js*`, {});

    cy.intercept('POST', '/opportunity/external', {}).as('postExternal');

    cy.intercept('PUT', '/user/changePwd', {}).as('changePwd');

    cy.intercept('GET', '/user/profile/*', {
      fixture: 'public-profile-res',
    }).as('getUserProfile');

    cy.intercept('/message/internal', {}).as('postInternalMessage');
  });

  it("should open a user's public profile and contact him", () => {
    cy.fixture('public-profile-res').then((userProfile) => {
      cy.visit(`/backoffice/profile/${userProfile.id}`, {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('access-token', '1234');
          window.localStorage.setItem('release-version', 'v100');
        },
      });
      cy.url().should('include', userProfile.id);
    });

    cy.get('[data-testid="form-contact-internal-message-subject"]')
      .scrollIntoView()
      .type('test');

    cy.get('[data-testid="form-contact-internal-message-message"]')
      .scrollIntoView()
      .type('test');

    cy.get('[data-testid="form-confirm-form-contact-internal-message"]')
      .scrollIntoView()
      .click();

    cy.get('[data-testid="profile-contact-form-confirm"]').should(
      'contain',
      'Votre message a été envoyé'
    );
  });

  it('should open backoffice public offers', () => {
    cy.fixture('auth-current-candidat-res').then((user) => {
      cy.visit(`/backoffice/candidat/${user.id}/offres/public`, {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('access-token', '1234');
          window.localStorage.setItem('release-version', 'v100');
        },
      });
      cy.url().should('include', user.id);
    });

    // check if list is complete
    cy.get('[data-testid="candidat-offer-list-container"]', { timeout: 20000 })
      .find('> div')
      .should('have.length', 16);

    // check if the right opportunity is open
    cy.fixture('user-opportunity-all-res').then((offersList) => {
      cy.url().should('include', offersList.offers[0].id);
      cy.get('[data-testid="candidat-offer-details-title"]').contains(
        offersList.offers[0].title
      );
    });

    // bookmark/unbookmark an offer from the list
    cy.fixture('user-opportunity-all-res').then((offersRes) => {
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

  it('should open backoffice private offers and add new opportunity', () => {
    cy.fixture('auth-current-candidat-res').then((user) => {
      cy.visit(`/backoffice/candidat/${user.id}/offres/private`, {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('access-token', '1234');
          window.localStorage.setItem('release-version', 'v100');
        },
      });
      cy.url().should('include', user.id);
    });
    // check if the right opportunity is open
    cy.fixture('user-opportunity-all-res').then((offersList) => {
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

    // modal should be closed
    cy.get('.uk-modal-body').should('not.exist');
  });

  it('should open backoffice cv candidat', () => {
    cy.fixture('auth-current-candidat-res').then((user) => {
      cy.visit(`/backoffice/candidat/${user.id}/cv`, {
        onBeforeLoad: function async(window) {
          window.localStorage.setItem('access-token', '1234');
          window.localStorage.setItem('release-version', 'v100');
        },
      });
      cy.url().should('include', user.id);
    });
    // catchphrase
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

    // presentation
    cy.get(`[data-testid="test-story-edit-icon"]`).scrollIntoView().click();
    const story = 'Here I present';
    cy.get('#form-story').clear().type(story);
    cy.get(`[data-testid="form-confirm-form-story"]`).click();
    cy.get(`[data-testid="cv-edit-story-content"]`).should('contain', story);

    // atouts/skills
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

    // formations
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

    // experience
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
    // save experience
    cy.get(`[data-testid="form-confirm-form-experience"]`)
      .scrollIntoView()
      .click();

    // save CV
    cy.contains('Sauvegarder').scrollIntoView().click();
  });

  it('should open backoffice candidate parameters', () => {
    cy.visit('/backoffice/parametres', {
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('access-token', '1234');
        window.localStorage.setItem('release-version', 'v100');
      },
    });

    // toggle hide CV
    cy.get('label[for="ent-toggle-hidden"]').click();
    cy.get(`[data-testid="test-confirm-hidden"]`).click();
    cy.wait('@putUserCandidatParams');
    cy.get(`[data-testid="test-toggle-hidden"]`).should('be.checked');
    cy.get('label[for="ent-toggle-hidden"]').click();
    cy.get(`[data-testid="test-toggle-hidden"]`).should('not.be.checked');

    // toggle is employed
    cy.get('label[for="ent-toggle-employedToggle"]').scrollIntoView().click();

    cy.get('#form-edit-employed-contract-container')
      .should('be.visible')
      .scrollIntoView()
      .click()
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

    // check help needs and modify
    cy.fixture('auth-current-candidat-res').then((user) => {
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        fixture: 'user-profile-candidate-help-modified',
      }).as('putUserProfile');
    });
    cy.fixture('auth-current-candidat-res').then((userCandidate) => {
      cy.get(`[data-testid="parametres-help-list"]`)
        .scrollIntoView()
        .find('li')
        .should('have.length', userCandidate.userProfile?.helpNeeds?.length);
    });
    cy.get(`[data-testid="parametres-help-card-button-edit"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="form-edit-helps-helps-tips"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="form-edit-helps-helps-cv"]`).scrollIntoView().click();
    cy.contains('Sauvegarder').scrollIntoView().click();

    cy.fixture('user-profile-candidate-help-modified').then((userProfile) => {
      cy.get(`[data-testid="parametres-help-list"]`)
        .scrollIntoView()
        .find('li')
        .should('have.length', userProfile.helpNeeds?.length);
    });

    // modify profile description
    cy.fixture('auth-current-candidat-res').then((user) => {
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        fixture: 'user-profile-candidate-description-modified',
      }).as('putUserProfile');
    });
    cy.get(`[data-testid="profile-description-placeholder"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="form-profile-description-description"]`)
      .scrollIntoView()
      .type('hello');
    cy.get(`[data-testid="form-confirm-form-profile-description"]`)
      .scrollIntoView()
      .click();
    cy.get(`[data-testid="profile-description"]`).should('contain', 'hello');

    // change profile picture
    cy.get(`[data-testid="profile-picture-upload-desktop"]`).selectFile(
      'assets/image-fixture.jpg',
      { force: true }
    );
    cy.wait('@uploadImage');

    // change professional information
    cy.fixture('auth-current-candidat-res').then((user) => {
      cy.intercept('PUT', `/user/profile/${user.id}`, {
        fixture: 'user-profile-candidate-professional-info-modified',
      }).as('putUserProfile');
    });
    const businessLine = 'Agriculture';
    const ambition = 'test';
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
