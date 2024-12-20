import { guideJourneyRequests } from '../../intercept/journey/guide.req';
import bootstrap from '../bootstrap';

describe('En tant que - Benevole', () => {
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
     * Intercept requests
     */
    guideJourneyRequests.POST.forEach((request) => {
      if (request.alias) {
        cy.intercept('POST', request.path, request.data).as(request.alias);
      } else cy.intercept('POST', request.path, request.data);
    });

    cy.visit('/orienter');
  });

  /**
   * Je souhaite orienter quelqu'un
   */
  describe('Je souhaite orienter', () => {
    // Formulaire
    it("J'affiche, remplis et valide le formulaire pour orienter", () => {
      cy.get('[data-testid="button-orienter"]').first().click();

      cy.get('.ReactModalPortal div').first().should('be.visible');

      cy.get('#form-candidate-contact-workerFirstName').type('John');

      cy.get('#form-candidate-contact-workerLastName').type('Doe');

      cy.get('#form-candidate-contact-structure').type('Entourage');

      cy.get('#form-candidate-contact-workerPosition').type('Educ Spé');

      cy.get('#form-candidate-contact-workerEmail').type('johndoe@gmail.com');

      cy.get('#form-candidate-contact-workerPhone').type('0698754321');

      cy.get('#form-candidate-contact-firstName').type('Jane');

      cy.get('#form-candidate-contact-lastName').type('Doe');

      cy.get('#form-candidate-contact-helpWith')
        .should('be.visible')
        .type('Empl');

      cy.get('#form-candidate-contact-helpWith')
        .find('.Select__menu')
        .should('be.visible')
        .find('.Select__option')
        .contains('Emploi')
        .click();

      cy.get('#form-candidate-contact-helpWith')
        .should('be.visible')
        .type('San');

      cy.get('#form-candidate-contact-helpWith')
        .find('.Select__menu')
        .should('be.visible')
        .find('.Select__option')
        .contains('Santé')
        .click();

      cy.get('#form-candidate-contact-gender-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Femme')
        .click();

      cy.get('#form-candidate-contact-birthDate').type('1996-04-24');

      cy.get('#form-candidate-contact-address').type('15 Rue du Port');

      cy.get('#form-candidate-contact-postalCode').type('75015');

      cy.get('#form-candidate-contact-city').type('Paris');

      cy.get('#form-candidate-contact-phone').type('0628145567');

      cy.get('#form-candidate-contact-email').type('janedoe@gmail.com');

      cy.get('#form-candidate-contact-registeredUnemploymentOffice-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Oui')
        .click();

      cy.get('#form-candidate-contact-administrativeSituation-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Passeport')
        .click();

      cy.get('#form-candidate-contact-workingRight-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Oui')
        .click();

      cy.get('#form-candidate-contact-accommodation-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Logement personnel')
        .click();

      cy.get('#form-candidate-contact-professionalSituation-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('CDI')
        .click();

      cy.get('#form-candidate-contact-resources-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('RSA')
        .click();

      // Weird bug, option is not available
      cy.get('#form-candidate-contact-domiciliation-container')
        .should('be.visible')
        .find('button')
        .click();

      cy.get('#form-candidate-contact-domiciliation-container')
        .find('.option')
        .contains('Oui')
        .click();

      cy.get('#form-candidate-contact-socialSecurity-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Oui')
        .click();

      cy.get('#form-candidate-contact-handicapped-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Oui')
        .click();

      cy.get('#form-candidate-contact-bankAccount-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Oui')
        .click();

      cy.get('#form-candidate-contact-businessLines')
        .should('be.visible')
        .type('Art');

      cy.get('#form-candidate-contact-businessLines')
        .find('.Select__menu')
        .should('be.visible')
        .find('.Select__option')
        .contains('Artisanat')
        .click();

      cy.get('#form-candidate-contact-businessLines')
        .should('be.visible')
        .type('Pro');

      cy.get('#form-candidate-contact-businessLines')
        .find('.Select__menu')
        .should('be.visible')
        .find('.Select__option')
        .contains('Propreté')
        .click();

      cy.get('#form-candidate-contact-description').type(
        'Voici ma description'
      );

      cy.get('#form-candidate-contact-heardAbout-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Autre')
        .click();

      cy.get('#form-candidate-contact-diagnostic').type('Voici son diagnostic');

      cy.get('label[for="form-candidate-contact-contactWithCoach"]').click();

      cy.get('button')
        .contains("J'envoie ma pré-inscription")
        .should('be.visible')
        .click();

      cy.wait('@postCandidateContact');

      cy.get('.ReactModalPortal div').should('not.exist');
    });
  });

  /**
   * Je souhaite contacter l'association
   */
  describe("Je souhaite contacter l'association", () => {
    it("J'affiche, remplis et valide le formulaire de contacte", () => {
      cy.get('[data-testid="button-contact"]').first().click();

      cy.get('.ReactModalPortal div').first().should('be.visible');

      cy.get('#form-interest-lastName').type('Doe');

      cy.get('#form-interest-firstName').type('John');

      cy.get('#form-interest-email').type('johndoe@gmail.com');

      cy.get('#form-interest-phone').type('0698754321');

      cy.get('#form-interest-structure').type('Test');

      cy.get('#form-interest-message').type('Form test');

      cy.get('#form-interest-heardAbout-container')
        .should('be.visible')
        .click()
        .find('.option')
        .contains('Autre')
        .click();

      cy.get('label[for="form-interest-cgu"]').click();

      cy.get('button').contains('Envoyer').click();

      cy.wait('@postContact');

      cy.get('[data-testid="success-modal-content"]').should('be.visible');

      cy.get('[data-testid="success-close-modal"]').click();

      cy.get('[data-testid="success-modal-content"]').should('not.exist');
    });
  });
});
