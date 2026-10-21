import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import { interceptCurrentUser } from '../../intercept/user/auth.req';
import {
  CURRENT_USER_ID,
  buildCurrentUser,
} from '../../../fixtures/src/messaging/messagingBuilders';
import {
  blockRealtimeSockets,
  interceptRealtime,
} from '../../intercept/realtime.req';
import bootstrap from '../bootstrap';

const PROFILE_ID = '11111111-1111-4111-8111-111111111111';

const signInAs = (role: string) => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  window.localStorage.setItem('access-token', 'fake-access-token');
  interceptCurrentUser({
    statusCode: 200,
    body: buildCurrentUser({ role }),
  });
  interceptCurrentUserSubResources();
  interceptRealtime();
};

/**
 * Builds the body returned by GET /user/profile/:userId for a fully filled in
 * member. Each test overrides only what it needs.
 */
const buildProfile = (overrides: Record<string, unknown> = {}) => ({
  id: PROFILE_ID,
  firstName: 'Aurélien',
  lastName: 'Leprêtre',
  role: 'Candidat',
  gender: 0,
  department: 'Nord (59)',
  currentJob: 'Chargé de mission',
  description: 'Une description de test du parcours professionnel.',
  elearningCompletedAt: '2024-01-01T00:00:00.000Z',
  unavailableAt: null,
  lastConnection: new Date().toISOString(),
  customNudges: [],
  nudges: [],
  sectorOccupations: [
    {
      id: 'sector-occupation-1',
      order: 1,
      businessSector: {
        id: 'sector-1',
        name: 'Communication et marketing',
      },
      occupation: {
        id: 'occupation-1',
        name: 'Responsable SEO',
        prefix: 'comme',
      },
    },
  ],
  experiences: [
    {
      id: 'experience-1',
      title: 'Cheffe de projet',
      company: 'Acme',
      description: 'Pilotage de projets web.',
      location: 'Lille',
      startDate: '2020-01-01',
      endDate: '2022-01-01',
      skills: [],
    },
  ],
  formations: [
    {
      id: 'formation-1',
      title: 'Master Informatique',
      institution: 'Université de Lille',
      description: '',
      location: '',
      startDate: '2015-01-01',
      endDate: '2017-01-01',
      skills: [],
    },
  ],
  skills: [{ id: 'skill-1', name: 'Python' }],
  userProfileLanguages: [
    {
      id: 'language-1',
      language: { id: 'lg-1', name: 'Anglais' },
      level: 'Courant',
    },
  ],
  interests: [{ id: 'interest-1', name: 'Escalade' }],
  reviews: [],
  contracts: [{ id: 'contract-1', name: 'CDI' }],
  occupations: [],
  hasExternalCv: false,
  hasPicture: false,
  company: null,
  achievements: [],
  linkedinUrl: 'https://www.linkedin.com/in/test',
  ...overrides,
});

const interceptProfile = (profile: Record<string, unknown>) => {
  cy.intercept('GET', `/user/profile/${PROFILE_ID}`, {
    statusCode: 200,
    body: profile,
  }).as('getProfile');
};

const visitProfile = (userId = PROFILE_ID) => {
  cy.visit(`/backoffice/profile/${userId}`, {
    onBeforeLoad: blockRealtimeSockets,
  });
  cy.wait('@getCurrent');
  cy.wait('@getProfile');
};

describe('En tant que - Membre connecté, je consulte le profil d’un autre membre', () => {
  bootstrap();

  describe('Coach qui consulte un candidat', () => {
    beforeEach(() => {
      signInAs('Coach');
      interceptProfile(buildProfile());
    });

    it('Affiche le nom, le rôle et la disponibilité du candidat', () => {
      visitProfile();

      cy.contains('Aurélien Leprêtre').should('be.visible');
      cy.contains('Candidat').should('be.visible');
      cy.contains('Disponible').should('be.visible');
      cy.contains('Nord (59)').should('be.visible');
    });

    it('Affiche les sections du profil d’un candidat', () => {
      visitProfile();

      cy.contains('Informations professionnelles').should('be.visible');
      cy.contains('Une description de test du parcours professionnel.').should(
        'be.visible'
      );
      cy.contains('Python').should('be.visible');
      cy.contains('h5', 'Expériences').should('be.visible');
      cy.contains('Cheffe de projet').should('be.visible');
      cy.contains('h5', 'Formations').should('be.visible');
      cy.contains('Master Informatique').should('be.visible');
      cy.contains("Centres d'intérêt").should('be.visible');
      cy.contains('Escalade').should('be.visible');
      cy.contains('Langues parlées').should('be.visible');
      cy.contains('Anglais').should('be.visible');
      cy.contains('Liens et documents').should('be.visible');
    });

    it('Propose de contacter le candidat et de mobiliser son réseau', () => {
      visitProfile();

      cy.contains('Contacter Aurélien').should('be.visible');
      cy.contains("pour l'aider dans sa recherche d'emploi").should(
        'be.visible'
      );
      cy.contains('button', 'Envoyer un message').should('be.visible');

      // Sections reserved for candidates
      cy.contains('Mobiliser mon réseau').should('be.visible');
      cy.contains('Types de contrats recherchés').should('be.visible');
      cy.contains('CDI').should('be.visible');
    });

    it('Invite à échanger quand le candidat n’a pas renseigné ses expériences', () => {
      interceptProfile(buildProfile({ experiences: [], formations: [] }));
      visitProfile();

      cy.contains("Aurélien n'a pas encore renseigné ses expériences").should(
        'be.visible'
      );
      cy.contains('Cheffe de projet').should('not.exist');
    });

    it('Indique que le candidat n’est pas disponible pour recevoir des demandes de contact', () => {
      interceptProfile(
        buildProfile({ unavailableAt: '2024-05-01T00:00:00.000Z' })
      );
      visitProfile();

      cy.contains(
        "Aurélien n'est pas disponible pour le moment pour recevoir des demandes de contact"
      ).should('be.visible');
      cy.contains('button', 'Envoyer un message').should('not.exist');
    });
  });

  describe('Candidat qui consulte un coach', () => {
    beforeEach(() => {
      signInAs('Candidat');
      interceptProfile(
        buildProfile({
          firstName: 'Camille',
          lastName: 'Dubois',
          role: 'Coach',
        })
      );
    });

    it('Affiche le nom et le rôle du coach', () => {
      visitProfile();

      cy.contains('Camille Dubois').should('be.visible');
      cy.contains('Coach').should('be.visible');
    });

    it('Propose de contacter le coach pour être aidé dans sa recherche', () => {
      visitProfile();

      cy.contains('Contacter Camille').should('be.visible');
      cy.contains("vous aide dans votre recherche d'emploi").should(
        'be.visible'
      );
      cy.contains('button', 'Envoyer un message').should('be.visible');
    });

    it('Masque les sections réservées aux candidats', () => {
      visitProfile();

      cy.contains('Informations professionnelles').should('be.visible');
      cy.contains('Je travaille comme Chargé de mission').should('be.visible');
      cy.contains('Mobiliser mon réseau').should('not.exist');
      cy.contains('Types de contrats recherchés').should('not.exist');
    });

    it('Masque les expériences et formations vides d’un coach', () => {
      interceptProfile(
        buildProfile({
          firstName: 'Camille',
          role: 'Coach',
          experiences: [],
          formations: [],
        })
      );
      visitProfile();

      cy.contains('Informations professionnelles').should('be.visible');
      cy.contains('h5', 'Expériences').should('not.exist');
      cy.contains('h5', 'Formations').should('not.exist');
    });
  });

  describe('Cas particuliers', () => {
    it('N’affiche pas la carte de contact sur mon propre profil', () => {
      signInAs('Coach');
      cy.intercept('GET', `/user/profile/${CURRENT_USER_ID}`, {
        statusCode: 200,
        body: buildProfile({ id: CURRENT_USER_ID, role: 'Coach' }),
      }).as('getProfile');

      cy.visit(`/backoffice/profile/${CURRENT_USER_ID}`, {
        onBeforeLoad: blockRealtimeSockets,
      });
      cy.wait('@getProfile');

      cy.contains('Aurélien Leprêtre').should('be.visible');
      cy.contains('Contacter Aurélien').should('not.exist');
    });

    it('Prévient un administrateur que le profil n’a pas finalisé son parcours de formation', () => {
      signInAs('Admin');
      interceptProfile(buildProfile({ elearningCompletedAt: null }));
      visitProfile();

      cy.contains(
        "Ce profil n'a pas finalisé son parcours de formation"
      ).should('be.visible');
    });

    it('N’affiche pas l’avertissement de formation à un coach', () => {
      signInAs('Coach');
      interceptProfile(buildProfile({ elearningCompletedAt: null }));
      visitProfile();

      cy.contains('Aurélien Leprêtre').should('be.visible');
      cy.contains(
        "Ce profil n'a pas finalisé son parcours de formation"
      ).should('not.exist');
    });

    it('Affiche une erreur et aucun profil quand l’API ne trouve pas le membre', () => {
      signInAs('Coach');
      cy.intercept('GET', `/user/profile/${PROFILE_ID}`, {
        statusCode: 404,
        body: { message: 'Not Found' },
      }).as('getProfile');

      visitProfile();

      cy.contains('Une erreur est survenue').should('be.visible');
      cy.contains('Informations professionnelles').should('not.exist');
      cy.contains('Contacter').should('not.exist');
    });

    it('Affiche une erreur quand l’API est indisponible', () => {
      signInAs('Candidat');
      cy.intercept('GET', `/user/profile/${PROFILE_ID}`, {
        statusCode: 500,
        body: {},
      }).as('getProfile');

      visitProfile();

      cy.contains('Une erreur est survenue').should('be.visible');
      cy.contains('Informations professionnelles').should('not.exist');
    });

    it('Redirige un visiteur non connecté vers la page de connexion', () => {
      cy.intercept('GET', '/current', { statusCode: 401, body: {} }).as(
        'getCurrentUnauthorized'
      );

      cy.visit(`/backoffice/profile/${PROFILE_ID}`);

      cy.url().should('include', '/login');
    });
  });
});
