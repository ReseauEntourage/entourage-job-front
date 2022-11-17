
describe('Candidat', () => {
    beforeEach(() => {
        cy.intercept('GET', '/cv/shares', {total:184222}).as('cvShares')
        cy.intercept('GET','/auth/current',{
            fixture: 'user-candidat'
        })
            .as('authCheck')
        cy.fixture('user-candidat')
            .then(user => {
                cy.intercept('GET', '/opportunity/user/count/' + user.id, {
                    "unseenOpportunities":0
                }).as('userCount')
                cy.intercept('GET', '/cv/?userId=' + user.id, {
                    fixture: 'cv-for-candidat'
                }).as('cvCandidat')
                cy.intercept('GET', '/opportunity/user/all/' + user.id + '?type=private&department[]=Seine-Saint-Denis+(93)', {
                    fixture: 'user-opportunity-all'
                }).as('allOpportunities')
                cy.intercept('GET', '/cv/read/' + user.id, {
                    fixture: 'candidat-cv-details'
                }).as('cvCandidatDetails')
                cy.intercept('GET', '/user/' + user.id, {
                    fixture: 'user-candidat'
                })
                cy.intercept('PUT', '/cv/read/', user.id,  {
                    fixture: 'candidat-cv-details'
                }).as('putCVCandidat')
            })
            cy.intercept('GET', '/user/candidate/checkUpdate',{noteHasBeenModified: true}).as('candidatCheckUpdate')
            cy.intercept('GET', '/cv/checkUpdate',{cvHasBeenModified: true}).as('cvCheckUpdate')
            cy.intercept('GET', 'https://tarteaucitron.io/load.js?domain=localhost:3001&uuid=0e7dccd2edb0f870afc26ab86d989e93ef6da0a9', {})
    
        })

    it('should open backoffice members', () => {
        cy.visit('/backoffice/candidat/offres', {
            onBeforeLoad: function async (window) {
                window.localStorage.setItem('access-token', "1234");                
            }
        })
        cy.get('[data-testid="candidat-add-offer"]')
        // cy.wait('@userCount')
        // cy.wait('@candidatCheckUpdate')
        // cy.wait('@cvCheckUpdate')
        // test if all members are in the table
        // cy.fixture('members').then((members) => {
        //     cy.get('[data-testid="member-list"]')
        //         .find('tr')
        //         .should('have.length', members.length)
        // })
    })

    it('should open backoffice cv candidat', () => {
        cy.visit('/backoffice/candidat/cv', {
            onBeforeLoad: function async (window) {
                window.localStorage.setItem('access-token', "1234");                
            }
        })
        // ajouter et supprimer une reco

    })
}) 