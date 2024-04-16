describe('Inscription', () => {
  it('should complete registration', () => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    cy.intercept('POST', '/user/registration', {
      statusCode: 201,
    }).as('postRegistration');

    // it('should open step-1', () => {
    cy.visit('/inscription');
    cy.url().should('include', 'step-1');
    // })
    // it('should fill step 1 and open step 2', () => {
    cy.get('[data-testid="form-registration-role-role-Candidat"]').click();
    cy.contains('Suivant').click();
    cy.url().should('include', 'step-2');
    // })
    // it('should fill step 2 open step 3', () => {
    cy.get(
      '[data-testid="form-registration-candidate-expectations-helpNeeds-tips"]'
    ).click();
    cy.contains('Suivant').click();
    // })
    // it('should fill step 3 open step 4', () => {
    cy.get('[data-testid="form-registration-candidate-info-birthDate"]').type(
      '1990-01-01'
    );
    cy.get('#form-registration-candidate-info-department')
      .click()
      .find('.Select__option')
      .contains('Paris')
      .click();
    cy.get('[data-testid="form-registration-candidate-info-workingRight"]')
      .click()
      .get('[data-testid="select-option-yes"]')
      .click();
    cy.contains('Suivant').click();
    // })
    // it('should fill step 4 open step 5', () => {
    cy.get(
      '[data-testid="form-registration-candidate-program-program-three_sixty"]'
    )
      .get('button')
      .should('be.disabled');
    cy.get(
      '[data-testid="form-registration-candidate-program-program-boost"]'
    ).click();
    cy.contains('Suivant').click();
    // })
    // it('should fill step 4 open step 5', () => {
    cy.get('[data-testid="form-registration-account-firstName"]').type('John');
    cy.get('[data-testid="form-registration-account-lastName"]').type('Doe');
    cy.get('[data-testid="form-registration-account-gender"]')
      .click()
      .get('[data-testid="select-option-0"]')
      .click();
    cy.get('#form-registration-account-email').type('johndoe@gmail.com');
    cy.get('#form-registration-account-phone').type('0698754321');

    cy.get('[data-testid="form-registration-account-password"]').type(
      'Azerty123!'
    );

    cy.get('[data-testid="form-registration-account-confirmPassword"]').type(
      'Azerty123!'
    );

    cy.contains('Suivant').click();
    // })
    // it('should be on confirmation page with queryParams', () => {
    cy.url().should('include', 'confirmation');
    cy.url().should('include', 'Candidat');
    cy.url().should('include', 'boost');
  });
});
