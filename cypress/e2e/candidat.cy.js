
describe('Candidat', () => {
    beforeEach(() => {
        cy.intercept('GET', '/cv/shares', {total:184222}).as('cvShares')
        cy.intercept('GET','/auth/current',{
            fixture: 'auth-current-candidat-res'
        })
            .as('authCheck')
        cy.fixture('auth-current-candidat-res')
            .then(user => {
                cy.intercept('GET', '/opportunity/candidate/count/' + user.id, {
                    "unseenOpportunities":0
                }).as('userCount')
                cy.intercept('GET', '/cv/' + user.id, {
                    fixture: 'cv-for-candidat'
                }).as('cvCandidat')
                cy.intercept('POST', '/cv/' + user.id, {
                    fixture: 'cv-for-candidat'
                }).as('postCvCandidat')
                cy.intercept('GET', '/opportunity/candidate/all/' + user.id + '?type=private&department[]=Seine-Saint-Denis+(93)', {
                    fixture: 'user-opportunity-all-res'
                }).as('allOpportunities')
                cy.intercept('GET', '/cv/read/' + user.id, {
                    fixture: 'cv-read-res'
                }).as('cvCandidatDetails')
                cy.intercept('GET', '/user/' + user.id, {
                    fixture: 'auth-current-candidat-res'
                })
                cy.intercept('PUT', '/cv/read/' + user.id,  {
                    fixture: 'cv-read-res'
                }).as('putCVCandidat')
                cy.intercept('PUT', '/user/candidate/' + user.id,  {
                    fixture: 'put-candidate-res'
                }).as('putCandidatParams')
                cy.intercept('GET', '/cv/lastVersion/' + user.id, {
                    fixture: 'cv-for-candidat'
                })
            })
            cy.intercept('GET', '/user/candidate/checkUpdate',{noteHasBeenModified: true}).as('candidatCheckUpdate')
            cy.intercept('GET', '/cv/checkUpdate',{cvHasBeenModified: true}).as('cvCheckUpdate')
            cy.intercept('GET', 'https://tarteaucitron.io/load.js?domain=localhost:3001&uuid=0e7dccd2edb0f870afc26ab86d989e93ef6da0a9', {})
            cy.intercept('PUT', '/user/changePwd', {}).as('changePwd')
        })

    it('should open backoffice members', () => {
        cy.visit('/backoffice/candidat/offres', {
            onBeforeLoad: function async (window) {
                window.localStorage.setItem('access-token', "1234");                
            }
        })
        cy.get('[data-testid="candidat-add-offer"]')
        cy.wait('@allOpportunities')
        // cy.wait('@candidatCheckUpdate')
        // cy.wait('@cvCheckUpdate')
        // // test if all members are in the table
        // cy.fixture('user-members-res').then((members) => {
        //     cy.get('[data-testid="member-list"]')
        //         .find('tr')
        //         .should('have.length', members.length)
        // })
    })

    // it('should open backoffice cv candidat', () => {
    //     cy.visit('/backoffice/candidat/cv', {
    //         onBeforeLoad: function async (window) {
    //             window.localStorage.setItem('access-token', "1234");                
    //         }
    //     })
    //     cy.get(
    //         `[data-testid="test-catchphrase-edit-icon"]`
    //     ).click({force: true});
    //     const catchPhrase = 'hello my name is Mike'
    //     cy.get('#form-catchphrase-catchphrase').type(catchPhrase)
    //     cy.get(`[data-testid="form-confirm-catchphrase-form"]`).click()
    //     cy.get(`[data-testid="cv-edit-catchphrase-content"]`).should('contain', catchPhrase)
    // })
    
    it('should open backoffice candidate parameters', () => {
        cy.visit('/backoffice/parametres',{
            onBeforeLoad: function async (window) {
                window.localStorage.setItem('access-token', "1234");                
            }
        })


        // toggle hide CV
        cy.get(
            `[data-testid="test-toggle-hidden"]`
          ).click({force: true});
        cy.get(
            `[data-testid="test-confirm-hidden"]`
          ).click();
        cy.wait('@putCandidatParams')
        cy.get(
            `[data-testid="test-toggle-hidden"]`
          ).should('be.checked')
        cy.get(
            `[data-testid="test-toggle-hidden"]`
          )
            .click({force: true})
            .should('not.be.checked')

        // toggle is employed
        cy.get(
            `[data-testid="test-toggle-employedToggle"]`
          ).click({force: true});
        cy.get('#form-edit-employed-contract').select('alt')
        cy.get('#form-edit-employed-endOfContract').type('2024-03-03')
        cy.contains('Valider').click()
        cy.wait('@putCandidatParams')
        cy.get(
            `[data-testid="test-toggle-employedToggle"]`
          ).should('be.checked')
        cy.get(
            `[data-testid="test-toggle-employedToggle"]`
          ).click({force: true})
          .should('not.be.checked')

        // change password
        cy.get('#form-change-pwd-oldPassword').type('blablabla', {force: true})
        cy.get('#form-change-pwd-newPassword').type('Linkedout123!', {force: true})
        cy.get('#form-change-pwd-confirmPassword').type('Linkedout123!', {force: true})
        cy.contains('Modifier').click()
        cy.wait('@changePwd')
    })
}) 