import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import { interceptCurrentUser } from '../../intercept/user/auth.req';
import {
  blockRealtimeSockets,
  interceptRealtime,
} from '../../intercept/realtime.req';
import { buildCurrentUser } from '../../../fixtures/src/messaging/messagingBuilders';
import bootstrap from '../bootstrap';

const COMPANY_ID = '22222222-2222-4222-8222-222222222222';
const COMPANY_URL = `/backoffice/companies/${COMPANY_ID}`;
const COLLABORATORS_URL = `${COMPANY_URL}/collaborators`;

const buildCompany = (overrides: Record<string, unknown> = {}) => ({
  id: COMPANY_ID,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  name: 'Maison Lumière',
  description: 'Une entreprise engagée pour l’insertion professionnelle.',
  logoUrl: null,
  department: { id: 'dept-59', name: 'Nord (59)', value: '59' },
  businessSectors: [{ id: 'sector-1', name: 'Services aux entreprises' }],
  url: 'https://maison-lumiere.example.com',
  hiringUrl: null,
  linkedInUrl: 'https://www.linkedin.com/company/maison-lumiere',
  goal: null,
  admin: { firstName: 'Nadia', lastName: 'Benali' },
  ...overrides,
});

const buildCollaborator = (overrides: Record<string, unknown> = {}) => ({
  id: 'collaborator-1',
  firstName: 'Paul',
  lastName: 'Marchand',
  email: 'paul.marchand@example.com',
  role: 'Coach',
  gender: 0,
  createdAt: '2024-03-15T00:00:00.000Z',
  conversations: [{ id: 'conversation-1' }, { id: 'conversation-2' }],
  companyUser: { role: 'employee', isAdmin: false },
  userProfile: {
    hasPicture: false,
    unavailableAt: null,
    currentJob: 'Chef de projet',
    sectorOccupations: [],
  },
  achievements: [],
  ...overrides,
});

const buildCompanyWithCollaborators = (
  overrides: Record<string, unknown> = {}
) => ({
  ...buildCompany(),
  users: [
    buildCollaborator({
      id: 'admin-1',
      firstName: 'Nadia',
      lastName: 'Benali',
      email: 'nadia.benali@example.com',
      companyUser: { role: 'rh', isAdmin: true },
    }),
    buildCollaborator(),
    buildCollaborator({
      id: 'collaborator-2',
      firstName: 'Sophie',
      lastName: 'Lambert',
      email: 'sophie.lambert@example.com',
      conversations: [],
    }),
  ],
  pendingInvitations: [
    {
      id: 'invitation-1',
      createdAt: '2024-05-02T00:00:00.000Z',
      updatedAt: '2024-05-02T00:00:00.000Z',
      email: 'invite.en.attente@example.com',
    },
  ],
  ...overrides,
});

/**
 * Signs a member in. As company administrator, `/current/company` returns the
 * company with an admin membership.
 */
const signInAs = (role: string, { isCompanyAdmin = false } = {}) => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  window.localStorage.setItem('access-token', 'fake-access-token');
  interceptCurrentUser({ statusCode: 200, body: buildCurrentUser({ role }) });
  interceptCurrentUserSubResources();
  interceptRealtime();
  if (isCompanyAdmin) {
    cy.intercept('GET', '/current/company', {
      statusCode: 200,
      body: {
        ...buildCompany(),
        companyUser: { role: 'rh', isAdmin: true },
      },
    }).as('currentCompany');
  }
};

const interceptCompany = (data: object, statusCode = 200) => {
  cy.intercept('GET', `/companies/${COMPANY_ID}`, {
    statusCode,
    body: data,
  }).as('getCompany');
};

const interceptCollaborators = (data: object, statusCode = 200) => {
  cy.intercept('GET', `/companies/${COMPANY_ID}/collaborators`, {
    statusCode,
    body: data,
  }).as('getCollaborators');
};

const visit = (url: string) => {
  cy.visit(url, { onBeforeLoad: blockRealtimeSockets });
  cy.wait('@getCurrent');
};

describe('En tant que - Membre connecté, je consulte la page d’une entreprise', () => {
  bootstrap();

  describe('Administrateur de l’entreprise', () => {
    beforeEach(() => {
      signInAs('Coach', { isCompanyAdmin: true });
      interceptCompany(buildCompany());
      interceptCollaborators(buildCompanyWithCollaborators());
    });

    it('Affiche le nom, le secteur et les informations de l’entreprise', () => {
      visit(COMPANY_URL);
      cy.wait('@getCompany');

      cy.contains('Maison Lumière').should('be.visible');
      cy.contains('Entreprise partenaire').should('be.visible');
      cy.contains('Services aux entreprises').should('be.visible');
      cy.contains(
        'Une entreprise engagée pour l’insertion professionnelle.'
      ).should('be.visible');
    });

    it('Affiche les liens de l’entreprise et son aperçu de collaborateurs sans action d’édition', () => {
      visit(COMPANY_URL);
      cy.wait('@getCompany');
      cy.wait('@getCollaborators');

      cy.contains('h5', 'Liens').should('be.visible');
      cy.contains("Collaborateurs d'entreprise").should('be.visible');
      cy.contains('Paul').should('be.visible');
      cy.contains('Sophie').should('be.visible');
      // The public view of a company is read-only, even for its admin
      cy.contains('button', 'Modifier').should('not.exist');
      cy.contains('Inviter des collaborateurs').should('not.exist');
    });

    it('Indique que l’entreprise n’a pas encore de collaborateurs', () => {
      interceptCollaborators(
        buildCompanyWithCollaborators({ users: [], pendingInvitations: [] })
      );
      visit(COMPANY_URL);
      cy.wait('@getCollaborators');

      cy.contains('Maison Lumière').should('be.visible');
      cy.contains(
        'Cette entreprise n’a pas encore de collaborateurs rattachés.'
      ).should('be.visible');
    });
  });

  describe('Coach sans droits d’administration', () => {
    it('Consulte la page d’une entreprise partenaire', () => {
      signInAs('Coach');
      interceptCompany(buildCompany());
      interceptCollaborators(buildCompanyWithCollaborators());

      visit(COMPANY_URL);
      cy.wait('@getCompany');

      cy.contains('Maison Lumière').should('be.visible');
      cy.contains('Entreprise partenaire').should('be.visible');
    });

    it('Affiche un message quand l’entreprise n’a renseigné aucune information', () => {
      signInAs('Candidat');
      interceptCompany(
        buildCompany({
          description: null,
          url: null,
          linkedInUrl: null,
          hiringUrl: null,
        })
      );
      interceptCollaborators(buildCompanyWithCollaborators());

      visit(COMPANY_URL);
      cy.wait('@getCompany');

      cy.contains(
        "Maison Lumière n'a pas encore renseigné ses informations"
      ).should('be.visible');
    });
  });

  describe('Cas refusés ou vides', () => {
    it('N’affiche aucune entreprise quand l’API ne la trouve pas', () => {
      signInAs('Coach');
      interceptCompany({ message: 'Not Found' }, 404);
      interceptCollaborators({ message: 'Not Found' }, 404);

      visit(COMPANY_URL);
      cy.wait('@getCompany');

      cy.contains('Entreprise partenaire').should('not.exist');
      cy.contains('Maison Lumière').should('not.exist');
    });

    it('Redirige un visiteur non connecté vers la page de connexion', () => {
      cy.intercept('GET', '/current', { statusCode: 401, body: {} }).as(
        'getCurrentUnauthorized'
      );

      cy.visit(COMPANY_URL);

      cy.url().should('include', '/login');
    });
  });
});

describe('En tant que - Administrateur d’entreprise, je gère mes collaborateurs', () => {
  bootstrap();

  describe('Liste des collaborateurs', () => {
    beforeEach(() => {
      signInAs('Coach', { isCompanyAdmin: true });
      interceptCompany(buildCompany());
    });

    it('Affiche le tableau des collaborateurs et leurs candidats contactés', () => {
      interceptCollaborators(buildCompanyWithCollaborators());
      visit(COLLABORATORS_URL);
      cy.wait('@getCollaborators');

      cy.contains('Gestion de vos collaborateurs').should('be.visible');
      cy.contains(
        'Retrouvez la liste de tous vos collaborateurs d’entreprise'
      ).should('be.visible');
      cy.contains('Candidats contactés').should('be.visible');
      cy.contains('Paul Marchand').should('be.visible');
      cy.contains('paul.marchand@example.com').should('be.visible');
      cy.contains('2 candidats').should('be.visible');
      cy.contains('Sophie Lambert').should('be.visible');
      cy.contains('0 candidat').should('be.visible');
    });

    it('N’affiche pas l’administrateur parmi ses collaborateurs', () => {
      interceptCollaborators(buildCompanyWithCollaborators());
      visit(COLLABORATORS_URL);
      cy.wait('@getCollaborators');

      cy.contains('Paul Marchand').should('be.visible');
      cy.contains('Nadia Benali').should('not.exist');
    });

    it('Affiche les invitations en attente avec leur adresse mail', () => {
      interceptCollaborators(buildCompanyWithCollaborators());
      visit(COLLABORATORS_URL);
      cy.wait('@getCollaborators');

      cy.contains('invite.en.attente@example.com').should('be.visible');
    });

    it('N’affiche aucune ligne quand l’entreprise n’a pas de collaborateurs', () => {
      interceptCollaborators(
        buildCompanyWithCollaborators({ users: [], pendingInvitations: [] })
      );
      visit(COLLABORATORS_URL);
      cy.wait('@getCollaborators');

      cy.contains('Gestion de vos collaborateurs').should('be.visible');
      cy.contains('Inviter vos collaborateurs').should('be.visible');
      cy.contains('Paul Marchand').should('not.exist');
      cy.contains('invite.en.attente@example.com').should('not.exist');
    });
  });

  describe('Invitation de collaborateurs', () => {
    it('Ouvre la fenêtre d’invitation avec sa présentation', () => {
      signInAs('Coach', { isCompanyAdmin: true });
      interceptCollaborators(buildCompanyWithCollaborators());
      visit(COLLABORATORS_URL);
      cy.wait('@getCollaborators');

      cy.contains('button', 'Inviter vos collaborateurs').click();

      cy.contains(
        'Invitez vos collaborateurs à devenir coachs bénévoles'
      ).should('be.visible');
      cy.contains('La mission de coach').should('be.visible');
      cy.contains('button', 'Inviter des collaborateurs').click();
      cy.contains('button', 'Envoyer les invitations').should('be.visible');
    });
  });

  describe('Accès refusé', () => {
    it('Affiche une erreur quand l’API refuse la liste des collaborateurs', () => {
      signInAs('Coach');
      interceptCompany(buildCompany());
      interceptCollaborators({ message: 'Forbidden' }, 403);

      visit(COLLABORATORS_URL);
      cy.wait('@getCollaborators');

      cy.contains(
        "Une erreur s'est produite lors de la récupération des collaborateurs de l'entreprise"
      ).should('be.visible');
      cy.contains('Paul Marchand').should('not.exist');
      cy.contains('Candidats contactés').should('not.exist');
    });

    it('Redirige un visiteur non connecté vers la page de connexion', () => {
      cy.intercept('GET', '/current', { statusCode: 401, body: {} }).as(
        'getCurrentUnauthorized'
      );

      cy.visit(COLLABORATORS_URL);

      cy.url().should('include', '/login');
    });
  });
});
