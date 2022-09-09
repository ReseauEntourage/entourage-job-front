describe('Navigation', () => {
  it('opens', () => {
    cy.visit(Cypress.env('base_url'))

    cy.contains('Je cherche un emploi').click()
    cy.url().should('include', 'travailler')

    cy.contains('Je recrute').click()
    cy.url().should('include', 'entreprises')

    cy.contains('Je veux aider').click()
    cy.url().should('include', 'aider')

    cy.contains('J\'oriente un candidat').click()
    cy.url().should('include', 'orienter')

    cy.contains('Découvrir les CV').click()
    cy.url().should('include', 'candidats')
  })
})