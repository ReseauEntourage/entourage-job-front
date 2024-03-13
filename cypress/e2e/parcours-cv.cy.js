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

    cy.intercept('POST', '/cv/count', {}).as('postCVCount');

    cy.intercept('POST', '/message/external', {
      fixture: 'post-external-message-res',
    }).as('postMessage');

    cy.intercept('GET', '/user/search/candidates*', {
      fixture: 'user-search-candidates-res',
    }).as('getCandidats');

    cy.intercept('GET', '/cv/shares', { total: 184222 }).as('cvShares');
    cy.intercept('GET', '/cv/published', { nbPublishedCVs: 2 }).as(
      'cvPublished'
    );
  });

  describe('Page /candidats', () => {
    beforeEach(() => {
      cy.visit('/candidats?employed=false');
    })

    it('Ouvrir les filtres et checker Paris', () => {
  
      cy.contains('Où ?').click();
  
      cy.contains('Paris et sa région').click();
  
      cy.wait('@getAllCV');
    });
  
    it('Créer une offre publique', () => {
  
  
      cy.get('[data-testid="search-candidates-post-opportunity-button"]').scrollIntoView().click();
  
      // cy.wait('@getCandidats');
  
      cy.get('#form-add-public-offer-title').scrollIntoView().type('Form test');
      cy.get('#form-add-public-offer-company')
        .scrollIntoView()
        .type('Random company');
      cy.get('#form-add-public-offer-companyDescription')
        .scrollIntoView()
        .type('Random presentation');
  
      cy.get('#form-add-public-offer-locations-0-department')
        .should('be.visible')
        .scrollIntoView()
        .type('Paris');
  
      cy.get('#form-add-public-offer-locations-0-department')
        .find('.Select__menu')
        .should('be.visible')
        .scrollIntoView()
        .find('.Select__option')
        .contains('Paris (75)')
        .click();
  
      cy.get('#form-add-public-offer-locations-0-address')
        .scrollIntoView()
        .type('Rue de Paris');
  
      cy.get('button').contains('Ajouter une adresse').scrollIntoView().click();
  
      cy.get('#form-add-public-offer-locations-1-department')
        .should('be.visible')
        .scrollIntoView()
        .type('Rhône');
  
      cy.get('#form-add-public-offer-locations-1-department')
        .find('.Select__menu')
        .should('be.visible')
        .scrollIntoView()
        .find('.Select__option')
        .contains('Rhône (69)')
        .click();
  
      cy.get('#form-add-public-offer-locations-1-address')
        .scrollIntoView()
        .type('Rue du Rhône');
  
      cy.get('#form-add-public-offer-recruiterFirstName')
        .scrollIntoView()
        .type('John');
      cy.get('#form-add-public-offer-recruiterName').scrollIntoView().type('Doe');
      cy.get('#form-add-public-offer-recruiterPosition')
        .scrollIntoView()
        .type('Random position');
      cy.get('#form-add-public-offer-recruiterMail')
        .scrollIntoView()
        .type('johndoe@gmail.com');
      cy.get('#form-add-public-offer-recruiterPhone')
        .scrollIntoView()
        .type('0698754321');
  
      cy.get('#form-add-public-offer-description')
        .scrollIntoView()
        .type('Random description');
  
      cy.get('#form-add-public-offer-contract-container')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('CDI')
        .click();
  
      cy.get('button').contains('Envoyer').click();
  
      cy.wait('@postOpportunity');
  
      cy.get('.ReactModalPortal div').should('not.exist');
    });
  
    it("Ouvrir la page d'un CV", () => {
  
      cy.fixture('cv-cards-random-res').then((cvs) => {
        cy.wait(500)
        cy.get(`[data-testid="card-${cvs.cvs[0].user.candidat.firstName}"]`)
        .scrollIntoView()
        .click();
        cy.url().should(
          'include',
          `/cv/${cvs.cvs[0].user.candidat.firstName.toLowerCase()}`
        );
      });
    });
  })

  describe('Page /cv/:candidat',() => {
    beforeEach(() => {
      // to be fixed: this should only be a visit command, but sends error
      cy.visit('/candidats?employed=false');
      cy.fixture('cv-cards-random-res').then((cvs) => {
        cy.wait(500)
        cy.get(`[data-testid="card-${cvs.cvs[0].user.candidat.firstName}"]`)
        .scrollIntoView()
        .click();
      });
    })

    it('Proposer une offre à un candidat', () => {
      cy.contains('Proposer une offre').scrollIntoView().click();
  
      // cy.wait('@getCandidats');
  
      cy.get('#form-add-private-offer-title').scrollIntoView().type('Form test');
      cy.get('#form-add-private-offer-company')
        .scrollIntoView()
        .type('Random company');
      cy.get('#form-add-private-offer-companyDescription')
        .scrollIntoView()
        .type('Random presentation');
  
      cy.get('#form-add-private-offer-locations-0-department')
        .should('be.visible')
        .scrollIntoView()
        .type('Paris');
  
      cy.get('#form-add-private-offer-locations-0-department')
        .find('.Select__menu')
        .should('be.visible')
        .scrollIntoView()
        .find('.Select__option')
        .contains('Paris (75)')
        .click();
  
      cy.get('#form-add-private-offer-locations-0-address')
        .scrollIntoView()
        .type('Rue de Paris');
  
      cy.get('button').contains('Ajouter une adresse').scrollIntoView().click();
  
      cy.get('#form-add-private-offer-locations-1-department')
        .should('be.visible')
        .scrollIntoView()
        .type('Rhône');
  
      cy.get('#form-add-private-offer-locations-1-department')
        .find('.Select__menu')
        .should('be.visible')
        .scrollIntoView()
        .find('.Select__option')
        .contains('Rhône (69)')
        .click();
  
      cy.get('#form-add-private-offer-locations-1-address')
        .scrollIntoView()
        .type('Rue du Rhône');
  
      cy.get('#form-add-private-offer-recruiterFirstName')
        .scrollIntoView()
        .type('John');
      cy.get('#form-add-private-offer-recruiterName')
        .scrollIntoView()
        .type('Doe');
      cy.get('#form-add-private-offer-recruiterPosition')
        .scrollIntoView()
        .type('Random position');
      cy.get('#form-add-private-offer-recruiterMail')
        .scrollIntoView()
        .type('johndoe@gmail.com');
      cy.get('#form-add-private-offer-recruiterPhone')
        .scrollIntoView()
        .type('0698754321');
  
      cy.get('#form-add-private-offer-description')
        .scrollIntoView()
        .type('Random description');
  
      cy.get('#form-add-private-offer-contract-container')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('CDI')
        .click();
  
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
        .find('.option')
        .contains('Une entreprise')
        .click();
  
      cy.get('#form-send-external-message-subject-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Coup de pouce')
        .click();
  
      cy.get('#form-send-external-message-message')
        .scrollIntoView()
        .type('Random message');
  
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
  })

});
