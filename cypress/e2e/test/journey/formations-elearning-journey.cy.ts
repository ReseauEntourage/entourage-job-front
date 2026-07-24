import { interceptCurrentUserSubResources } from '../../intercept/current-user.req';
import { formationsJourneyRequests } from '../../intercept/journey/formations.req';
import bootstrap from '../bootstrap';

describe('Formations', () => {
  /**
   * Generate fixtures
   */
  bootstrap();

  const currentUserId = '4d3c885c-4859-4e7b-a428-902812964f08';

  const answer = (
    id: string,
    label: string,
    isCorrect: boolean,
    questionId: string
  ) => ({ id, questionId, label, isCorrect, explanation: null });

  const question = (id: string, unitId: string, answers: unknown[]) => ({
    id,
    unitId,
    label: `Quelle est la bonne réponse pour ${id} ?`,
    answers,
  });

  const unit = ({
    id,
    title,
    questions,
    completed,
  }: {
    id: string;
    title: string;
    questions: unknown[];
    completed?: boolean;
  }) => ({
    id,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    title,
    description: 'Description du module',
    durationMinutes: 5,
    videoUrl: `https://www.youtube.com/watch?v=${id}`,
    questions,
    roles: [],
    userCompletions: completed
      ? [
          {
            id: `completion-${id}`,
            userId: currentUserId,
            unitId: id,
            validatedAt: '2026-01-01T00:00:00.000Z',
          },
        ]
      : [],
  });

  const interceptElearningUnits = (units: unknown[]) => {
    cy.intercept('GET', '/elearning/units*', {
      statusCode: 200,
      body: units,
    }).as('elearningUnits');
  };

  const answerAndConfirm = (answerId: string, nextButtonText: string) => {
    cy.get(`[data-testid="elearning-quiz-answer-${answerId}"]`).click({
      force: true,
    });
    cy.contains('button', 'Valider').click();
    cy.contains('button', nextButtonText).click();
  };

  beforeEach(() => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    window.localStorage.setItem('access-token', '1234');

    formationsJourneyRequests.GET.forEach((request) => {
      if (request.alias) {
        cy.intercept('GET', request.path, request.data).as(request.alias);
      } else {
        cy.intercept('GET', request.path, request.data);
      }
    });
    formationsJourneyRequests.POST.forEach((request) => {
      if (request.alias) {
        cy.intercept('POST', request.path, request.data).as(request.alias);
      } else {
        cy.intercept('POST', request.path, request.data);
      }
    });

    cy.intercept('GET', '/current', {
      fixture: 'auth-current-candidate-onboarding-completed-res',
    }).as('currentIdentity');

    interceptCurrentUserSubResources();
  });

  describe('Etant donné que je suis un utilisateur authentifié sur la page Formations', () => {
    it('should complete a not-yet-started module: open it, watch the video, pass the quiz, and see it marked as done', () => {
      const moduleOne = unit({
        id: 'elearning-unit-1',
        title: 'Module Formations 1',
        questions: [
          question('formations-question-1', 'elearning-unit-1', [
            answer(
              'formations-answer-1-good',
              'Bonne réponse',
              true,
              'formations-question-1'
            ),
            answer(
              'formations-answer-1-bad',
              'Mauvaise réponse',
              false,
              'formations-question-1'
            ),
          ]),
        ],
      });
      interceptElearningUnits([moduleOne]);

      cy.visit('/backoffice/ressources/formations');
      cy.wait('@elearningUnits');

      cy.contains('Module Formations 1')
        .parents('[class*=StyledElearningUnitCardContainer]')
        .contains('button', 'Démarrer')
        .click();

      cy.get('[data-testid="elearning-unit-modal-elearning-unit-1"]').should(
        'be.visible'
      );
      cy.contains('Regardez la vidéo puis passez au quiz');

      cy.contains('button', 'Passer au quiz').click();
      cy.contains('Quelle est la bonne réponse pour formations-question-1 ?');

      answerAndConfirm('formations-answer-1-good', 'Terminer');
      cy.wait('@postElearningCompletion');

      cy.get('[data-testid="elearning-unit-modal-elearning-unit-1"]').should(
        'not.exist'
      );
      cy.contains('Module Formations 1')
        .parents('[class*=StyledElearningUnitCardContainer]')
        .contains('button', 'Revoir');
    });

    it('should let the user replay an already-completed module without creating a duplicate completion', () => {
      const completedUnit = unit({
        id: 'elearning-unit-1',
        title: 'Module Formations 1',
        completed: true,
        questions: [
          question('formations-question-1', 'elearning-unit-1', [
            answer(
              'formations-answer-1-good',
              'Bonne réponse',
              true,
              'formations-question-1'
            ),
            answer(
              'formations-answer-1-bad',
              'Mauvaise réponse',
              false,
              'formations-question-1'
            ),
          ]),
        ],
      });
      interceptElearningUnits([completedUnit]);

      cy.visit('/backoffice/ressources/formations');
      cy.wait('@elearningUnits');

      cy.contains('Module Formations 1')
        .parents('[class*=StyledElearningUnitCardContainer]')
        .contains('button', 'Revoir')
        .click();

      cy.get('[data-testid="elearning-unit-modal-elearning-unit-1"]').should(
        'be.visible'
      );

      cy.contains('button', 'Passer au quiz').click();
      answerAndConfirm('formations-answer-1-good', 'Terminer');
      cy.wait('@postElearningCompletion');

      cy.get('[data-testid="elearning-unit-modal-elearning-unit-1"]').should(
        'not.exist'
      );

      // Toujours une seule carte pour ce module, toujours marquée "terminé"
      cy.contains('Module Formations 1')
        .parents('[class*=StyledElearningUnitCardContainer]')
        .contains('button', 'Revoir');
      cy.get('button').contains('Démarrer').should('not.exist');
    });

    it('should display each module with its own individual status when the user skipped the onboarding eLearning step', () => {
      cy.fixture('auth-current-candidate-onboarding-completed-res').then(
        (user) => {
          cy.intercept('GET', '/current', {
            statusCode: 200,
            body: { ...user, elearningCompletedAt: null },
          }).as('currentIdentity');
        }
      );

      const completedUnit = unit({
        id: 'elearning-unit-1',
        title: 'Module Formations 1',
        completed: true,
        questions: [],
      });
      const notCompletedUnit = unit({
        id: 'elearning-unit-2',
        title: 'Module Formations 2',
        questions: [],
      });
      interceptElearningUnits([completedUnit, notCompletedUnit]);

      cy.visit('/backoffice/ressources/formations');
      cy.wait('@elearningUnits');

      cy.contains('Module Formations 1')
        .parents('[class*=StyledElearningUnitCardContainer]')
        .contains('button', 'Revoir');

      cy.contains('Module Formations 2')
        .parents('[class*=StyledElearningUnitCardContainer]')
        .contains('button', 'Démarrer');
    });
  });
});
