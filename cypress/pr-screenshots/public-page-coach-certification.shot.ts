import bootstrap from '../e2e/test/bootstrap';
import { visitClientSide } from './publicPages';

describe('Page publique : certificat de coach', () => {
  bootstrap();

  it('certificat', () => {
    cy.intercept('GET', '**/gamification/achievements/certificat/public', {
      statusCode: 200,
      body: {
        firstName: 'Camille',
        lastName: 'Martin',
        gender: 1,
        achievedAt: '2026-05-12T00:00:00.000Z',
        title: 'Coach Entourage Pro',
        achievementType: 'super_engaged_coach',
      },
    }).as('getAchievement');
    visitClientSide('/coach-certification/certificat');
    cy.wait('@getAchievement');
    cy.contains('CERTIFICAT').should('be.visible');
    cy.capture('Certificat de coach');
  });

  it('certificat introuvable', () => {
    cy.intercept('GET', '**/gamification/achievements/inconnu/public', {
      statusCode: 404,
      body: {},
    }).as('getAchievement');
    visitClientSide('/coach-certification/inconnu');
    cy.wait('@getAchievement');
    cy.contains("Ce certificat n'est pas disponible").should('be.visible');
    cy.capture('Certificat de coach : introuvable');
  });
});
