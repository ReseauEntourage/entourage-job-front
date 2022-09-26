describe('Parcours Orienter', () => {


    beforeEach(() => {
        cy.intercept('POST', 'api/v1/mail/contact-us', {
            statusCode: 200,
            message: "mail sent"
        })
            .as('postContact')
    })

    it('Ouvrir la popup du formulaire', () => {

        cy.visit('/orienter')

        cy.get('[data-test="button-contact"]')
            .first()
            .click()

        cy.wait(500)

        cy.get('.ReactModalPortal div')
            .first()
            .should('be.visible')
        
    })

    it('Remplir le formulaire, envoyer et fermer', () => {

        cy.get('#form-interest-lastName')
            .scrollIntoView()
            .type('Doe')

        cy.get('#form-interest-firstName')
            .scrollIntoView()
            .type('John')
            
        cy.get('#form-interest-email')
            .scrollIntoView()
            .type('johndoe@gmail.com')
            
        cy.get('#form-interest-phone')
            .scrollIntoView()
            .type('0698754321')

        cy.get('#form-interest-structure')
            .scrollIntoView()
            .type('Test')

        cy.get('#form-interest-message')
            .scrollIntoView()
            .type('Form test')
        
        cy.get('#form-interest-heardAbout')
            .scrollIntoView()
            .select('Autre')
        
        cy.get('#form-interest-cgu')
            .scrollIntoView()
            .check()

        cy.get('button').contains('Envoyer').click()

        cy.wait('@postContact')

        cy.get('[data-test="success-modal-content"]')
            .should('be.visible')

        cy.get('[data-test="close-modal"]')
            .click()

        cy.get('[data-test="success-modal-content"]')
            .should('not.exist')

    })

}) 