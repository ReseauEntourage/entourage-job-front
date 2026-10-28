import { interceptCurrentUserSubResources } from '../e2e/intercept/current-user.req';
import { wizardJourneyRequests } from '../e2e/intercept/journey/wizard.req';
import bootstrap from '../e2e/test/bootstrap';

const BIRTH_DATE_FIELD =
  '[data-testid="form-registration-candidate-info-birthDate"]';

describe('Saisie de date : champ unique jj/mm/aaaa', () => {
  bootstrap();

  beforeEach(() => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    wizardJourneyRequests.GET.forEach((request) => {
      if (request.alias) {
        cy.intercept('GET', request.path, request.data).as(request.alias);
      } else {
        cy.intercept('GET', request.path, request.data);
      }
    });
    interceptCurrentUserSubResources();
    cy.intercept('GET', '/current', { statusCode: 401 });

    // Reaches the birth date step of the candidate registration
    cy.visit('/wizard');
    cy.get('[data-testid="wizard-flow-selection-candidate"]')
      .should('be.visible')
      .click();
    cy.contains('button', "Commencer l'inscription").click();
    cy.url().should('include', '/wizard/run');
    cy.contains('sur quoi aimeriez-vous un coup de pouce');
    cy.wait('@nudges');
    cy.get('[data-testid^="nudgeIds-"]').first().click();
    cy.get('[data-testid="wizard-next-step-btn"]').click();
    cy.contains('Quel métier(s) et secteur(s) visez-vous ?');
    cy.get('#form-onboarding-profile-completion-businessSectorId0')
      .should('be.visible')
      .click();
    cy.get('#form-onboarding-profile-completion-businessSectorId0')
      .find('.Select__option')
      .first()
      .click();
    cy.get('[data-testid="wizard-next-step-btn"]')
      .should('not.be.disabled')
      .click();
    cy.wait('@compatibleProfiles');
    cy.get('[data-testid="wizard-next-step-btn"]').click();
    cy.get(BIRTH_DATE_FIELD).should('be.visible');
  });

  it('date de naissance : vide, saisie, puis date impossible', () => {
    cy.capture('Date de naissance vide', {
      caption:
        'Le format attendu jj/mm/aaaa est visible, avec l’icône calendrier.',
      capture: 'viewport',
    });

    cy.get(BIRTH_DATE_FIELD).type('14031987');
    cy.get(BIRTH_DATE_FIELD).should('have.value', '14/03/1987');
    cy.capture('Date de naissance saisie', {
      caption: 'On tape 14031987 : les / s’ajoutent tout seuls.',
      capture: 'viewport',
    });

    cy.get(BIRTH_DATE_FIELD).clear().type('31021990');
    cy.get('[data-testid="wizard-next-step-btn"]').click();
    cy.contains("Cette date n'existe pas");
    cy.capture('Date de naissance impossible', {
      caption: 'Un 31/02 est refusé avec un message sur le champ.',
      capture: 'viewport',
    });
  });
});
