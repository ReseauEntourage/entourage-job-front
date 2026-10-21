import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import { interceptCurrentUser } from '../../intercept/user/auth.req';
import { buildCurrentUser } from '../../../fixtures/src/messaging/messagingBuilders';
import bootstrap from '../bootstrap';

const signInAs = (role: string) => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  window.localStorage.setItem('access-token', 'fake-access-token');
  interceptCurrentUser({ statusCode: 200, body: buildCurrentUser({ role }) });
  interceptCurrentUserSubResources();
};

const interceptProfiles = (
  profiles: Array<Record<string, unknown>>,
  alias = 'getProfiles'
) => {
  cy.intercept({ method: 'GET', pathname: '/user/profile' }, (req) => {
    req.reply({ statusCode: 200, body: profiles });
  }).as(alias);
};

describe('En tant que - Membre connecté, je consulte l’annuaire du réseau', () => {
  bootstrap();

  let baseProfile: Record<string, unknown>;

  before(() => {
    cy.fixture('public-profile-res').then((profile) => {
      baseProfile = profile;
    });
  });

  it('Affiche le titre de la page et les membres retournés par l’API', () => {
    signInAs('Coach');
    interceptProfiles([
      { ...baseProfile, id: 'p1', firstName: 'Alice', lastName: 'Martin' },
      { ...baseProfile, id: 'p2', firstName: 'Bruno', lastName: 'Durand' },
    ]);

    cy.visit('/backoffice/annuaire');
    cy.wait('@getCurrent');
    cy.wait('@getProfiles');

    cy.contains('Bienvenue sur votre réseau').should('be.visible');
    cy.contains('Alice').should('be.visible');
    cy.contains('Bruno').should('be.visible');
  });

  it('Interroge l’API avec un décalage et une limite de pagination', () => {
    signInAs('Candidat');
    interceptProfiles([{ ...baseProfile, id: 'p1', firstName: 'Alice' }]);

    cy.visit('/backoffice/annuaire');
    cy.wait('@getProfiles')
      .its('request.url')
      .should('match', /offset=0/)
      .and('match', /limit=\d+/);
  });

  it('N’affiche aucun membre quand l’API retourne une liste vide', () => {
    signInAs('Coach');
    interceptProfiles([]);

    cy.visit('/backoffice/annuaire');
    cy.wait('@getProfiles');

    cy.contains('Bienvenue sur votre réseau').should('be.visible');
    cy.contains('Alice').should('not.exist');
  });
});
