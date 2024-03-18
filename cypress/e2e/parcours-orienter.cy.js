/* eslint-disable no-undef */
describe('Parcours Orienter', () => {
  beforeEach(() => {
    cy.intercept('POST', '/contact/contactUs', {
      statusCode: 201,
    }).as('postContact');

    cy.intercept('POST', '/contact/candidate', {
      statusCode: 201,
    }).as('postCandidateContact');

    cy.intercept('GET', '/cv/shares', { total: 184222 });
    
    cy.visit('/orienter');
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  });

  describe('Orienter un candidat', () => {
    it('Remplir le formulaire, envoyer et fermer', () => {
      cy.get('[data-testid="button-orienter"]').first().click();

      cy.wait(500);

      cy.get('.ReactModalPortal div').first().should('be.visible');

      cy.get('#form-candidate-contact-workerFirstName')
        .scrollIntoView()
        .type('John');

      cy.get('#form-candidate-contact-workerLastName')
        .scrollIntoView()
        .type('Doe');

      cy.get('#form-candidate-contact-structure')
        .scrollIntoView()
        .type('Entourage');

      cy.get('#form-candidate-contact-workerPosition')
        .scrollIntoView()
        .type('Educ Spé');

      cy.get('#form-candidate-contact-workerEmail')
        .scrollIntoView()
        .type('johndoe@gmail.com');

      cy.get('#form-candidate-contact-workerPhone')
        .scrollIntoView()
        .type('0698754321');

      cy.get('#form-candidate-contact-firstName').scrollIntoView().type('Jane');

      cy.get('#form-candidate-contact-lastName').scrollIntoView().type('Doe');

      cy.get('#form-candidate-contact-helpWith')
        .should('be.visible')
        .scrollIntoView()
        .type('Empl');

      cy.get('#form-candidate-contact-helpWith')
        .find('.Select__menu')
        .should('be.visible')
        .scrollIntoView()
        .find('.Select__option')
        .contains('Emploi')
        .click();

      cy.get('#form-candidate-contact-helpWith')
        .should('be.visible')
        .scrollIntoView()
        .type('San');

      cy.get('#form-candidate-contact-helpWith')
        .find('.Select__menu')
        .should('be.visible')
        .scrollIntoView()
        .find('.Select__option')
        .contains('Santé')
        .click();

      cy.get('#form-candidate-contact-gender-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Femme')
        .click();

      cy.get('#form-candidate-contact-birthDate')
        .scrollIntoView()
        .type('1996-04-24');

      cy.get('#form-candidate-contact-address')
        .scrollIntoView()
        .type('15 Rue du Port');
      cy.get('#form-candidate-contact-postalCode')
        .scrollIntoView()
        .type('75015');
      cy.get('#form-candidate-contact-city').scrollIntoView().type('Paris');

      cy.get('#form-candidate-contact-phone')
        .scrollIntoView()
        .type('0628145567');

      cy.get('#form-candidate-contact-email')
        .scrollIntoView()
        .type('janedoe@gmail.com');

      cy.get('#form-candidate-contact-registeredUnemploymentOffice-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Oui')
        .click();

      cy.get('#form-candidate-contact-administrativeSituation-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Passeport')
        .click();

      cy.get('#form-candidate-contact-workingRight-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Oui')
        .click();

      cy.get('#form-candidate-contact-accommodation-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Logement personnel')
        .click();

      cy.get('#form-candidate-contact-professionalSituation-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('CDI')
        .click();

      cy.get('#form-candidate-contact-resources-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('RSA')
        .click();

      cy.get('#form-candidate-contact-domiciliation-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Oui')
        .click();

      cy.get('#form-candidate-contact-socialSecurity-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Oui')
        .click();

      cy.get('#form-candidate-contact-handicapped-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Oui')
        .click();

      cy.get('#form-candidate-contact-bankAccount-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Oui')
        .click();

      cy.get('#form-candidate-contact-businessLines')
        .should('be.visible')
        .scrollIntoView()
        .type('Art');

      cy.get('#form-candidate-contact-businessLines')
        .find('.Select__menu')
        .should('be.visible')
        .scrollIntoView()
        .find('.Select__option')
        .contains('Artisanat')
        .click();

      cy.get('#form-candidate-contact-businessLines')
        .should('be.visible')
        .scrollIntoView()
        .type('Pro');

      cy.get('#form-candidate-contact-businessLines')
        .find('.Select__menu')
        .should('be.visible')
        .scrollIntoView()
        .find('.Select__option')
        .contains('Propreté')
        .click();

      cy.get('#form-candidate-contact-description')
        .scrollIntoView()
        .type('Voici ma description');

      cy.get('#form-candidate-contact-heardAbout-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Autre')
        .click();

      cy.get('#form-candidate-contact-diagnostic')
        .scrollIntoView()
        .type('Voici son diagnostic');

      cy.get('label[for="form-candidate-contact-contactWithCoach"]')
        .scrollIntoView()
        .click();

      cy.get('button')
        .contains("J'envoie ma pré-inscription")
        .should('be.visible')
        .scrollIntoView()
        .click();

      cy.wait('@postCandidateContact');

      cy.get('.ReactModalPortal div').should('not.exist');
    });
  });

  describe('Nous contacter', () => {
    it('Remplir le formulaire, envoyer et fermer', () => {
      cy.get('[data-testid="button-contact"]').scrollIntoView().first().click();

      cy.wait(500);

      cy.get('.ReactModalPortal div').first().should('be.visible');

      cy.get('#form-interest-lastName').scrollIntoView().type('Doe');

      cy.get('#form-interest-firstName').scrollIntoView().type('John');

      cy.get('#form-interest-email').scrollIntoView().type('johndoe@gmail.com');

      cy.get('#form-interest-phone').scrollIntoView().type('0698754321');

      cy.get('#form-interest-structure').scrollIntoView().type('Test');

      cy.get('#form-interest-message').scrollIntoView().type('Form test');

      cy.get('#form-interest-heardAbout-container')
        .should('be.visible')
        .scrollIntoView()
        .click()
        .find('.option')
        .contains('Autre')
        .click();

      cy.get('label[for="form-interest-cgu"]').scrollIntoView().click();

      cy.get('button').contains('Envoyer').click();

      cy.wait('@postContact');

      cy.get('[data-testid="success-modal-content"]').should('be.visible');

      cy.get('[data-testid="success-close-modal"]').click();

      cy.get('[data-testid="success-modal-content"]').should('not.exist');
    });
  });
});
