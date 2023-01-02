describe('Parcours Entreprises', () => {
  beforeEach(() => {
    cy.intercept('POST', '/contact/company', {
      statusCode: 201,
    }).as('postContactCompany');
  });

  it('Ouvrir la popup du formulaire', () => {
    describe('Bouton header', () => {
      cy.visit('/entreprises');
      cy.get('[data-testid="button-contact-company-header"]')
        .first()
        .scrollIntoView()
        .click();

      cy.wait(500);

      cy.get('.ReactModalPortal div').first().should('be.visible');
    });

    describe('Bouton première section', () => {
      cy.visit('/entreprises');
      cy.get('[data-testid="button-contact-company-first-section"]')
        .first()
        .scrollIntoView()
        .click();

      cy.wait(500);

      cy.get('.ReactModalPortal div').first().should('be.visible');
    });

    describe('Bouton dernière section', () => {
      cy.visit('/entreprises');
      cy.get('[data-testid="button-contact-company-last-section"]')
        .first()
        .scrollIntoView()
        .click();

      cy.wait(500);

      cy.get('.ReactModalPortal div').first().should('be.visible');
    });
  });

  it('Remplir le formulaire, envoyer et fermer', () => {
    cy.get('#form-company-contact-firstName').scrollIntoView().type('John');

    cy.get('#form-company-contact-lastName').scrollIntoView().type('Doe');

    cy.get('#form-company-contact-approach')
      .scrollIntoView()
      .select('information');

    cy.get('#form-company-contact-email')
      .scrollIntoView()
      .type('johndoe@gmail.com');

    cy.get('#form-company-contact-phone').scrollIntoView().type('0698754321');

    cy.get('#form-company-contact-company').scrollIntoView().type('Entourage');

    cy.get('#form-company-contact-position')
      .scrollIntoView()
      .type('Développeur');

    cy.get('#form-company-contact-zone')
      .scrollIntoView()
      .type('Paris{downArrow}{enter}');

    cy.get('#form-company-contact-heardAbout').scrollIntoView().select('Autre');

    cy.get('button').contains('Envoyer').click();

    cy.wait('@postContactCompany');

    cy.get('.ReactModalPortal div').should('not.exist');
  });
});
