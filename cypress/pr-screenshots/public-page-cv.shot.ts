import bootstrap from '../e2e/test/bootstrap';
import { visitClientSide } from './publicPages';

const CV_ID = 'c67bcb92-fbd6-471a-8c96-0ecdbf37006d';

const publicCV = {
  id: CV_ID,
  firstName: 'Aurélien',
  lastName: 'Leprêtre',
  role: 'Candidat',
  userProfile: {
    department: 'Nord (59)',
    description:
      'Aurélien est motivé et rigoureux. Il cherche un poste en logistique, proche de Lille.',
    linkedinUrl: null,
    hasPicture: false,
    skills: [{ id: 's1', name: 'Gestion de stock' }],
    contracts: [{ id: 'c1', name: 'CDI' }],
    userProfileLanguages: [
      { id: 'l1', language: { id: 'fr', name: 'Français' } },
    ],
    interests: [{ id: 'i1', name: 'Football' }],
    experiences: [
      {
        id: 'e1',
        title: 'Préparateur de commandes',
        company: 'Entrepôt du Nord',
        location: 'Lille',
        description: 'Préparation et expédition des commandes.',
        startDate: '2022-01-01T00:00:00.000Z',
        endDate: null,
        skills: [],
      },
    ],
    formations: [],
  },
};

describe('Page publique : CV public', () => {
  bootstrap();

  it('CV d’un candidat', () => {
    cy.intercept('GET', `**/users/public-cvs/${CV_ID}`, {
      statusCode: 200,
      body: publicCV,
    }).as('getPublicCV');
    visitClientSide(`/cv/${CV_ID}`);
    cy.wait('@getPublicCV');
    cy.contains('Retour').should('be.visible');
    cy.capture('CV public', {
      caption:
        'Le lien « Retour », la photo et le nom sont visibles sous le menu.',
    });
  });

  it('profil indisponible', () => {
    cy.intercept('GET', '**/users/public-cvs/inconnu', {
      statusCode: 404,
      body: {},
    }).as('getPublicCV');
    visitClientSide('/cv/inconnu');
    cy.wait('@getPublicCV');
    cy.contains('Ce profil n’est pas disponible').should('be.visible');
    cy.capture('CV public : profil indisponible');
  });
});
