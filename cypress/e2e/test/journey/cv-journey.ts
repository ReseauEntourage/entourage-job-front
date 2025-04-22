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

    cy.contains('Où ?').click();

    cy.contains('Paris et sa région').click();

    cy.wait('@getAllCV');
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
