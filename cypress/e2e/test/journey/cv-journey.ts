import bootstrap from '../bootstrap';
import { cvJourneyRequests } from '../../intercept/journey/cv.req';

describe('Parcours CV', () => {
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
     * Remove modal
     */
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    /**
     * Intercept GET requests
     */
    cvJourneyRequests.GET.map((request) => {
      if (request.alias)
        cy.intercept('GET', request.path, request.data).as(request.alias);
      else cy.intercept('GET', request.path, request.data);
    });
    /**
     * Intercept POST requests
     */
    cvJourneyRequests.POST.map((request) => {
      if (request.alias)
        cy.intercept('POST', request.path, request.data).as(request.alias);
      else cy.intercept('POST', request.path, request.data);
    });
    /**
     * Intercept PUT requests -- no PUT request for now
     */
    // cvJourneyRequests.PUT.map((request) => {
    //   if (request.alias)
    //     cy.intercept('PUT', request.path, request.data).as(request.alias);
    //   else cy.intercept('PUT', request.path, request.data);
    // });

    cy.fixture('cv-url-res').then((cv) => {
      cy.intercept(
        'GET',
        `/cv/url/${cv.cv.user.candidat.firstName.toLowerCase()}*`,
        cv
      ).as('getCV');
    });
  });

  /**
   * Je souhaite gérer les CVs
   */
  describe('Page /candidats', () => {
    cy.visit('/candidats?employed=false');
    cy.get('[data-testid="app-splash-screen"]').should('not.visible');

    cy.contains('Où ?').click();

    cy.contains('Paris et sa région').click();

    cy.wait('@getAllCV');
  });

  it('Créer une offre publique', () => {
    cy.get('[data-testid="search-candidates-post-opportunity-button"]')
      .scrollIntoView()
      .click();

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

  /**
   * Je souhaite ouvrir la page d'un CV
   */
  it("Ouvrir la page d'un CV", () => {
    cy.fixture('cv-cards-random-res').then((cvs) => {
      cy.get(`[data-testid="card-${cvs.cvs[0].user.candidat.firstName}"]`)
        .should('be.visible')
        .click();
      cy.url().should(
        'include',
        `/cv/${cvs.cvs[0].user.candidat.firstName.toLowerCase()}`
      );
    });
  });

  /**
   * Je souhaite proposer une offre à un candidat
   */
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

  /**
   * Je souhaite contacter un candidat
   */
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

  /**
   * Je souhaite partager sur Linkedin
   */
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
