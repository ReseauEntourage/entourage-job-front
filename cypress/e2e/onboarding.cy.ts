describe('Onboarding', () => {
    beforeEach(() => {
        window.localStorage.setItem('entourage-pro-modal-closed', 'true');

    })

    it('should complete onboarding', () => {

        // first interception: without onboarding infos
        cy.intercept('GET', '/auth/current', {
            fixture: 'auth-current-candidat-onboarding0-res',
        });

        cy.visit(`/backoffice/dashboard`, {
            onBeforeLoad: function async(window) {
                window.localStorage.setItem('access-token', '1234');
                window.localStorage.setItem('release-version', 'v100');
            },
        });

        // need of fixture content to fill the forms
        cy.fixture('auth-current-candidat-res').then((user) => {


            // first step: help needs
            cy.get(`[data-testid="form-onboarding-candidate-helps-helpNeeds-${user.userProfile.helpNeeds[0].name}"]`).click();
            
            //intercept the PUT request to update the user profile
            cy.intercept('PUT', `/user/profile/${user.id}`, {
                fixture: 'auth-current-candidat-onboarding1-res'
            });
            
            // submit first step
            cy.get('[data-testid="form-confirm-form-onboarding-candidate-helps"]').click();

            // label in the select differs from the fixture
            cy.get('#form-onboarding-candidate-job-searchBusinessLine0')
                .click()
                .find('.Select__option')
                .contains('Agriculture')
                .click();

            //intercept the PUT request to update the user profile
            cy.intercept('PUT', `/user/profile/${user.id}`, {
                fixture: 'auth-current-candidat-onboarding2-res'
            });
                
            // submit second step
            cy.get('[data-testid="form-confirm-form-onboarding-candidate-job"]').click();

            // fill description
            cy.get('[data-testid="form-onboarding-profile-description"]').type(user.userProfile.description);


            // intercept requests
            cy.intercept('PUT', `/user/profile/${user.id}`, {
                fixture: 'auth-current-candidat-res'
            });
            cy.intercept('GET', '/auth/current', {
                fixture: 'auth-current-candidat-res',
            });
        
            // confirm final step
            cy.get('[data-testid="form-confirm-form-onboarding-profile"]').click();


            // dashboard should be updated
            cy.contains("Préparer un entretien").should('be.visible') // to do: get the label from the constants with "findConstantFromValue" utils
            cy.contains(user.userProfile.description).should('be.visible')
        });


    })
})