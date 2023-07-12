/* eslint-disable no-undef */
describe('Parcours CV', () => {
  beforeEach(() => {
    cy.intercept('GET', '/cv/cards/random*', {
      fixture: 'cv-cards-random-res',
    }).as('getAllCV');

    cy.fixture('cv-url-res').then((cv) => {
      cy.intercept(
        'GET',
        `/cv/url/${cv.cv.user.candidat.firstName.toLowerCase()}*`,
        cv
      ).as('getCV');
    });

    cy.intercept('POST', '/opportunity', {
      fixture: 'opportunity-res',
    }).as('postOpportunity');

    cy.intercept('POST', '/cv/count').as('postCVCount');

    cy.intercept('POST', '/externalMessage', {
      fixture: 'post-external-message-res',
    }).as('postMessage');

    cy.intercept('GET', '/user/search/candidates*', {
      fixture: 'user-search-candidates-res',
    }).as('getCandidats');

    cy.intercept('GET', '/cv/shares', { total: 184222 }).as('cvShares');
  });

  it('Ouvrir les filtres et checker Paris', () => {
    cy.visit('/candidats?employed=false');

    cy.contains('Où ?').click();

    cy.contains('Paris et sa région').click();

    cy.wait('@getAllCV');
  });
  it("Ouvrir la page d'un CV", () => {
    cy.fixture('cv-cards-random-res').then((cvs) => {
      cy.get(
        `[data-testid="card-${cvs.cvs[0].user.candidat.firstName}"]`
      ).click();
      cy.url().should(
        'include',
        `/cv/${cvs.cvs[0].user.candidat.firstName.toLowerCase()}`
      );
    });
  });

  it('Proposer une offre à un candidat', () => {
    cy.contains('Proposer une offre').scrollIntoView().click();

    // cy.wait('@getCandidats');

    cy.get('#form-offer-isPublic').scrollIntoView().click();
    cy.get('#form-offer-title').scrollIntoView().type('Form test');
    cy.get('#form-offer-company').scrollIntoView().type('Random company');
    cy.get('#form-offer-recruiterFirstName').scrollIntoView().type('John');
    cy.get('#form-offer-recruiterName').scrollIntoView().type('Doe');
    cy.get('#form-offer-recruiterPosition')
      .scrollIntoView()
      .type('Random position');
    cy.get('#form-offer-recruiterMail')
      .scrollIntoView()
      .type('johndoe@gmail.com');
    cy.get('#form-offer-recruiterPhone').scrollIntoView().type('0698754321');
    cy.get('input[name="department"]').then((elem) => {
      elem.val('Hauts-de-Seine (92)');
    });
    cy.get('#form-offer-description')
      .scrollIntoView()
      .type('Random description');
    cy.get('#form-offer-contract').scrollIntoView().select('CDI');

    cy.get('#form-offer-address0')
      .scrollIntoView()
      .type('New York City Baby', { force: true });

    cy.get('#react-select-4-input').type('92', { force: true });

    cy.get('.select__option').click();

    cy.get('button').contains('Envoyer').click();

    cy.wait('@postOpportunity');

    cy.get('.ReactModalPortal div').should('not.exist');
  });

  it('Contacter un candidat', () => {
    cy.contains('Envoyer un message').scrollIntoView().click();

    cy.get('#form-send-external-message-senderFirstName')
      .scrollIntoView()
      .type('John');
    cy.get('#form-send-external-message-senderLastName')
      .scrollIntoView()
      .type('Doe');
    cy.get('#form-send-external-message-senderEmail')
      .scrollIntoView()
      .type('johndoe@gmail.com');
    cy.get('#form-send-external-message-senderPhone')
      .scrollIntoView()
      .type('0698754321');

    cy.get('#form-send-external-message-type-container')
      .should('be.visible')
      .scrollIntoView()
      .click()
      .find('button')
      .contains('Une entreprise')
      .click();

    cy.get('#form-send-external-message-subject-container')
      .should('be.visible')
      .scrollIntoView()
      .click()
      .find('button')
      .contains('Coup de pouce')
      .click();

    cy.get('#form-send-external-message-message')
      .scrollIntoView()
      .type('Random message');

    cy.get('label[for="form-send-external-message-optInContact"]')
      .scrollIntoView()
      .click();

    cy.get('label[for="form-send-external-message-optInNewsletter"]')
      .scrollIntoView()
      .click();

    cy.get('button').contains('Envoyer').click();

    cy.wait('@postMessage');

    cy.get('.ReactModalPortal div').should('not.exist');
  });

  it('Partager sur LinkedIn', () => {
    cy.window().then((win) => {
      cy.stub(win, 'open', (url) => {
        win.location.href.includes('https://www.linkedin.com/');
      }).as('popup');
    });

    cy.get('.SocialMediaShareButton--linkedin')
      .first()
      .should('be.visible')
      .scrollIntoView()
      .click();

    cy.get('@popup').should('be.called');
  });
});
