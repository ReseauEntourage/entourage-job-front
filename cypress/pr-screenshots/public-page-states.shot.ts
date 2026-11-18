import bootstrap from '../e2e/test/bootstrap';
import {
  capturePublicPage,
  prepareVisitor,
  visitClientSide,
  waitForPublicNav,
} from './publicPages';

/**
 * States of the public pages that the plain page captures do not show: CV list with cards,
 * empty list, newsletter validation errors, "good news" CV page of a candidate who found a
 * job. Used to prove that a style refactor leaves them unchanged.
 */

const NAMES = ['Aurélien', 'Marie', 'Karim', 'Sophie', 'Lucas', 'Inès'];

const cvUser = (index: number) => ({
  id: `cv-user-${index}`,
  firstName: NAMES[index % NAMES.length],
  userProfile: {
    hasPicture: false,
    sectorOccupations: [
      {
        businessSector: { id: `sector-${index}`, name: 'Logistique' },
        occupation: { id: `occupation-${index}`, name: 'Cariste' },
      },
    ],
  },
});

const interceptCVList = (body: unknown, statusCode = 200) => {
  cy.intercept('GET', /\/users\/public-cvs\?/, { statusCode, body }).as(
    'getPublicCVs'
  );
};

describe('Pages publiques : états', () => {
  bootstrap();

  it('liste de CV avec des cartes et le bouton « Voir plus »', () => {
    interceptCVList(Array.from({ length: 6 }, (_, index) => cvUser(index)));
    prepareVisitor();
    cy.visit('/candidats');
    waitForPublicNav();
    // The list is only populated once the intercepted request has answered.
    cy.wait('@getPublicCVs');
    cy.capture('Liste de CV', {
      caption: 'Cartes de candidats et bouton « Voir plus ».',
    });
  });

  it('liste de CV vide', () => {
    interceptCVList([]);
    prepareVisitor();
    cy.visit('/candidats');
    waitForPublicNav();
    // The list is only populated once the intercepted request has answered.
    cy.wait('@getPublicCVs');
    cy.capture('Liste de CV vide', {
      caption: 'Message affiché quand aucun profil ne correspond.',
    });
    cy.contains('Aucun profil correspondat trouvé').should('be.visible');
  });

  it('erreurs de validation de la newsletter', () => {
    prepareVisitor();
    cy.visit('/cette-page-nexiste-pas', { failOnStatusCode: false });
    waitForPublicNav();
    cy.get('[data-testid="nl-submit-btn"]').click();
    cy.get('[data-testid="nl-error-msg"]').should('be.visible');
    cy.get('#newsletterForm').capture('Newsletter : erreurs', {
      caption: 'Messages affichés quand le formulaire est envoyé vide.',
    });
  });

  it('CV d’un candidat en emploi', () => {
    interceptCVList(Array.from({ length: 3 }, (_, index) => cvUser(index)));
    // A JSON `null` answer is a CV that exists but is no longer published.
    cy.intercept('GET', '**/users/public-cvs/cv-employed', {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: 'null',
    }).as('getPublicCV');
    visitClientSide('/cv/cv-employed');
    cy.wait('@getPublicCV');
    cy.contains('bonne nouvelle').should('be.visible');
    cy.wait('@getPublicCVs');
    cy.capture('CV d’un candidat en emploi', {
      caption: 'Page « bonne nouvelle » avec les CV à soutenir.',
    });
  });
});
