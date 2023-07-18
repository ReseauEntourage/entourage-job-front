/* eslint-disable no-undef */
describe('Candidat', () => {
  beforeEach(() => {
    cy.intercept('GET', '/cv/shares', { total: 184222 }).as('cvShares');

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
      }).as('putCandidatParams');

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
    });

    cy.intercept('GET', `https://tarteaucitron.io/load.js*`, {});

    cy.intercept('POST', '/opportunity/external', {}).as('postExternal');

    cy.intercept('PUT', '/user/changePwd', {}).as('changePwd');
  });

  it('should open backoffice public offers', () => {
    cy.visit('/backoffice/candidat/offres', {
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('access-token', '1234');
        window.localStorage.setItem('release-version', 'v100');
      },
    });

    // check if list is complete
    cy.get('[data-testid="candidat-offer-list-container"]')
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

  it('should open backoffice public offers and add new opportunity', () => {
    cy.visit('/backoffice/candidat/offres', {
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('access-token', '1234');
        window.localStorage.setItem('release-version', 'v100');
      },
    });
    // check if the right opportunity is open
    cy.fixture('user-opportunity-all-res').then((offersList) => {
      cy.url().should('include', offersList.offers[0].id);
      cy.get('[data-testid="candidat-offer-details-title"]').contains(
        offersList.offers[0].title
      );
    });
    cy.get('[data-testid="candidat-add-offer-main"]').click();
    cy.get('#form-offer-external-title').scrollIntoView().type('test');
    cy.get('#form-offer-external-company').scrollIntoView().type('test');
    cy.get('#form-offer-external-department-container')
      .scrollIntoView()
      .click();
    cy.get(
      '#form-offer-external-department-container .options-container .option button'
    )
      .first()
      .click();
    cy.get('#form-offer-external-contract-container').scrollIntoView().click();
    cy.get(
      '#form-offer-external-contract-container .options-container .option button'
    )
      .first()
      .click();
    cy.get('#form-offer-external-recruiterFirstName')
      .scrollIntoView()
      .type('test');
    cy.get('#form-offer-external-recruiterName').scrollIntoView().type('test');
    cy.get('#form-offer-external-recruiterMail')
      .scrollIntoView()
      .type('test@gmail.com');
    cy.get('#form-offer-external-description').scrollIntoView().type('test');
    cy.get('#form-offer-external-link').scrollIntoView().type('test');
    cy.get('button').contains('Envoyer').click();
    cy.wait('@postExternal');

    // modal should be closed
    cy.get('.uk-modal-body').should('not.exist');
  });

  it('should open backoffice cv candidat', () => {
    cy.visit('/backoffice/candidat/cv', {
      onBeforeLoad: function async(window) {
        window.localStorage.setItem('access-token', '1234');
        window.localStorage.setItem('release-version', 'v100');
      },
    });
    cy.get(`[data-testid="test-catchphrase-edit-icon"]`).click({ force: true });
    const catchPhrase = 'hello my name is Mike';
    cy.get('#form-catchphrase-catchphrase').type(catchPhrase);
    cy.get(`[data-testid="form-confirm-catchphrase-form"]`).click();
    cy.get(`[data-testid="cv-edit-catchphrase-content"]`).should(
      'contain',
      catchPhrase
    );
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
    cy.get(`[data-testid="test-toggle-hidden"]`).click({ force: true });
    cy.get(`[data-testid="test-confirm-hidden"]`).click();
    cy.wait('@putCandidatParams');
    cy.get(`[data-testid="test-toggle-hidden"]`).should('be.checked');
    cy.get(`[data-testid="test-toggle-hidden"]`)
      .click({ force: true })
      .should('not.be.checked');

    // toggle is employed
    cy.get(`[data-testid="test-toggle-employedToggle"]`).click({ force: true });
    cy.get('#form-edit-employed-contract').select('alt');
    cy.get('#form-edit-employed-endOfContract').type('2024-03-03');
    cy.contains('Valider').click();
    cy.wait('@putCandidatParams');
    cy.get(`[data-testid="test-toggle-employedToggle"]`).should('be.checked');
    cy.get(`[data-testid="test-toggle-employedToggle"]`)
      .click({ force: true })
      .should('not.be.checked');

    // change password
    cy.get('#form-change-pwd-oldPassword').type('blablabla', { force: true });
    cy.get('#form-change-pwd-newPassword').type('Linkedout123!', {
      force: true,
    });
    cy.get('#form-change-pwd-confirmPassword').type('Linkedout123!', {
      force: true,
    });
    cy.contains('Modifier').click();
    cy.wait('@changePwd');
  });
});
