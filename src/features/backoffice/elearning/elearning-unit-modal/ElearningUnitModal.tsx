import { useMemo, useState } from 'react';

import { Button, Text } from '@/src/components/ui';
import { H3, H5 } from '@/src/components/ui/Headings';
import { Modal, useModalContext } from '@/src/features/modals/Modal';
import { ElearningUnit } from '../elearning.types';
import { useElearning } from '../useElearning';
import {
  StyledElearningUnitModalActions,
  StyledElearningUnitModalContainer,
  StyledElearningUnitModalHeader,
  StyledInviteToGoToQuiz,
} from './ElearningUnitModal.styles';
import { ElearningUnitModalQuiz } from './ElearningUnitModalQuiz';
import { ElearningUnitModalVideo } from './ElearningUnitModalVideo';

export interface ElearningUnitModalProps {
  elearningUnit: ElearningUnit;
}

export enum ElearningUnitModalMode {
  VIDEO = 'VIDEO',
  QUIZ = 'QUIZ',
}

export const ElearningUnitModal = ({
  elearningUnit,
}: ElearningUnitModalProps) => {
  const [mode, setMode] = useState<ElearningUnitModalMode>(
    ElearningUnitModalMode.VIDEO
  );
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizSelectedAnswerByQuestionId, setQuizSelectedAnswerByQuestionId] =
    useState<Record<string, string>>({});
  const [quizCorrectQuestionIds, setQuizCorrectQuestionIds] = useState<
    Record<string, true>
  >({});
  const [quizError, setQuizError] = useState<string | null>(null);

  const { completeUnit } = useElearning();
  const modal = useModalContext();

  const questions = elearningUnit.questions ?? [];
  const currentQuestion = questions[quizQuestionIndex];
  const currentSelectedAnswerId = currentQuestion
    ? quizSelectedAnswerByQuestionId[currentQuestion.id]
    : undefined;
  const currentSelectedAnswer = currentQuestion?.answers?.find(
    (answer) => answer.id === currentSelectedAnswerId
  );
  const isLastQuestion =
    questions.length > 0 && quizQuestionIndex === questions.length - 1;
  const isCurrentQuestionValidatedCorrect = currentQuestion
    ? !!quizCorrectQuestionIds[currentQuestion.id]
    : false;

  const closeModal = () => {
    modal.onClose?.();
  };

  const startQuiz = () => {
    setMode(ElearningUnitModalMode.QUIZ);
    setQuizQuestionIndex(0);
    setQuizSelectedAnswerByQuestionId({});
    setQuizCorrectQuestionIds({});
    setQuizError(null);
  };

  const onConfirm = () => {
    if (mode === ElearningUnitModalMode.VIDEO) {
      startQuiz();
    }
    if (mode === ElearningUnitModalMode.QUIZ) {
      if (questions.length === 0) {
        completeUnit(elearningUnit.id);
        closeModal();
        return;
      }

      if (!currentQuestion) {
        setQuizError("Impossible d'afficher cette question.");
        return;
      }

      // Étape 1 : valider la réponse de la question courante
      if (!isCurrentQuestionValidatedCorrect) {
        if (!currentSelectedAnswerId) {
          setQuizError('Sélectionne une réponse pour valider.');
          return;
        }

        if (!currentSelectedAnswer?.isCorrect) {
          setQuizError("Ce n'est pas la bonne réponse. Essaie encore.");
          return;
        }

        setQuizError(null);
        setQuizCorrectQuestionIds((prev) => ({
          ...prev,
          [currentQuestion.id]: true,
        }));
        return;
      }

      // Étape 2 : question validée -> passer à la suivante ou terminer
      if (!isLastQuestion) {
        setQuizQuestionIndex((prev) => prev + 1);
        return;
      }

      completeUnit(elearningUnit.id);
      closeModal();
    }
  };

  const buttonText = useMemo(() => {
    if (mode === ElearningUnitModalMode.VIDEO) {
      return 'Passer au quiz';
    }

    if (questions.length === 0) {
      return 'Confirmer';
    }

    if (!isCurrentQuestionValidatedCorrect) {
      return 'Valider';
    }

    return isLastQuestion ? 'Terminer' : 'Question suivante';
  }, [
    mode,
    questions.length,
    isLastQuestion,
    isCurrentQuestionValidatedCorrect,
  ]);

  const onQuizAnswerChange = (answerId: string) => {
    if (!currentQuestion) {
      return;
    }

    setQuizError(null);
    setQuizSelectedAnswerByQuestionId((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
  };

  return (
    <Modal
      id={`elearning-unit-modal-${elearningUnit.id}`}
      size="large"
      withCloseButton
    >
      <StyledElearningUnitModalContainer>
        <StyledElearningUnitModalHeader>
          <H3 title={elearningUnit.title} />
        </StyledElearningUnitModalHeader>
        {mode === ElearningUnitModalMode.QUIZ && (
          <ElearningUnitModalQuiz
            questions={questions}
            quizQuestionIndex={quizQuestionIndex}
            currentQuestion={currentQuestion}
            currentSelectedAnswerId={currentSelectedAnswerId}
            isCurrentQuestionValidatedCorrect={
              isCurrentQuestionValidatedCorrect
            }
            hasError={!!quizError}
            onAnswerChange={onQuizAnswerChange}
          />
        )}
        {mode === ElearningUnitModalMode.VIDEO && (
          <>
            <ElearningUnitModalVideo
              title={elearningUnit.title}
              videoUrl={elearningUnit.videoUrl}
            />
            <StyledInviteToGoToQuiz>
              {mode === ElearningUnitModalMode.VIDEO && (
                <>
                  <H5 title="Regardez la vidéo puis passez au quiz" center />
                  <Text center>
                    Après avoir visionné la vidéo, cliquez sur "Passer au quiz"
                    pour répondre aux questions.
                  </Text>
                </>
              )}
            </StyledInviteToGoToQuiz>
          </>
        )}
        <StyledElearningUnitModalActions>
          <Button
            onClick={onConfirm}
            variant="secondary"
            style={{
              ...(mode === ElearningUnitModalMode.VIDEO
                ? { display: 'block', width: '100%' }
                : {}),
            }}
          >
            {buttonText}
          </Button>
        </StyledElearningUnitModalActions>
      </StyledElearningUnitModalContainer>
    </Modal>
  );
};
