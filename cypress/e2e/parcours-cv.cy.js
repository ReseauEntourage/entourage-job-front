describe('Parcours CV', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/cv/cards/random*', { fixture: 'cvs.json' }).as(
      'getAllCV'
    );

    cy.fixture('cv').then((cv) => {
      cy.intercept(
        'GET',
        '/api/v1/cv/' + cv.cv.user.candidat.firstName.toLowerCase() + '*',
        cv
      ).as('getCV');
    });

    cy.intercept('POST', '/api/v1/opportunity', {
      fixture: 'response-opportunity',
    }).as('postOpportunity');

    cy.intercept('GET', '/api/v1/user/search/candidates*', {
      fixture: 'candidats-query',
    }).as('getCandidats');
  });

  it('Ouvrir les filtres et checker Paris', () => {
    cy.visit('/candidats?employed=false');

    cy.contains('Où ?').click();

    cy.contains('Paris et sa région').click();

    cy.wait('@getAllCV');
  });

  it("Ouvrir la page d'un CV", () => {
    cy.fixture('cvs').then((cvs) => {
      cy.get(
        `[data-testid="card-${cvs.cvs[0].user.candidat.firstName}"]`
      ).click();
      cy.url().should(
        'include',
        '/cv/' + cvs.cvs[0].user.candidat.firstName.toLowerCase()
      );
    });
  });

  it('Contacter un candidat', () => {
    cy.contains('Contactez-moi').scrollIntoView().click();

    cy.wait('@getCandidats');

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
      .click();

    cy.get('@popup').should('be.called');
  });
});
