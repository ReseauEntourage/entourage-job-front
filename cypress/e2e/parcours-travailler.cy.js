describe('Parcours travailler', () => {
    beforeEach(() => {
        cy.intercept('GET', 'contact/campaigns', {
            statusCode: 201,
            fixture: 'get-campaigns-res'
        }).as('getCampaigns')
        cy.intercept('POST', 'contact/candidateInscription', {
            statusCode: 201,
        }).as('postInscription')
    })

    it(("Ouvrir la page et le formulaire d'inscription"), () => {
        cy.visit('/travailler');
        cy.get('[data-testid="cta-inscription"]').first().click();
        cy.wait(500);
        cy.get('.ReactModalPortal div').first().should('be.visible');
    })

    it('Remplir le formulaire, envoyer et fermer', () => {
        
        cy.get('[data-testid="form-candidate-inscription-location"]').click();
        cy.get('[data-testid="select-option-93"]').click();
        cy.get('[data-testid="form-candidate-inscription-birthdate"]').type("1994-02-22");
        cy.get('[data-testid="form-candidate-inscription-workingRight"]').click();
        cy.get('[data-testid="select-option-yes"]').click();
        cy.get('[data-testid="form-candidate-inscription-firstName"]').type("John");
        cy.get('[data-testid="form-candidate-inscription-lastName"]').type("Doe");
        cy.get('[data-testid="form-candidate-inscription-phone"]').type("0698754321");
        cy.get('[data-testid="form-candidate-inscription-email"]').type("test@gmail.com");
        cy.get('[data-testid="form-candidate-inscription-heardAbout"]').click();
        cy.get('[data-testid="select-option-LinkedIn"]').click();
        cy.get('[data-testid="form-candidate-inscription-infoCoSubtitle"]').should('include.text', '174 rue de Championnet 75018, Paris');
        cy.get('[data-testid="infoco-radio-5"]').click();
        cy.get('button').contains('Valider').should('be.visible').click();
        cy.wait('@postInscription');
        cy.get('button').contains('Fermer').should('be.visible').click();
        cy.get('.ReactModalPortal div').should('not.exist');

    })
})
