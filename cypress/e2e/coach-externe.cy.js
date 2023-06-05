describe('Coach externe', () => {
    beforeEach(() => {
        cy.intercept('GET', '/auth/current', {
            fixture: 'auth-current-coach-externe-res',
          }).as('authCheck');

          cy.fixture('auth-current-coach-externe-res').then((user) => {
            cy.intercept('GET', '/user/' + user.id, {
                fixture: 'auth-current-coach-externe-res',
              });
          })
    })

    it('should get candidate list', () => {

        cy.visit('/backoffice/candidat/list', {
            onBeforeLoad: function async(window) {
                window.localStorage.setItem('access-token', '1234');
            },
        });

        cy.get('[data-testid="member-list"] > tr').its('length').should('eq', 2) 

    })

    it('should get params for the user and possibility to return to list', () => {

        cy.visit('/backoffice/parametres', {
            onBeforeLoad: function async(window) {
                window.localStorage.setItem('access-token', '1234');
            },
        });

        cy.get('[data-testid="linkeduser-email-span"]').should('not.exist')

        

    })

})