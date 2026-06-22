import { useMemo, useState } from 'react';

import { Button, Text } from '@/src/components/ui';
import { H3, H5 } from '@/src/components/ui/Headings';
import { Modal, useModalContext } from '@/src/features/modals/Modal';
import { ElearningUnit } from '../elearning.types';
import { useElearning } from '../useElearning';
import {
  StyledElearningUnitModalActions,
  StyledElearningUnitModalContainer,
  StyledElearningUnitModalBody,
  StyledElearningUnitModalHeader,
  StyledInviteToGoToQuiz,
} from './ElearningUnitModal.styles';
import { ElearningUnitModalQuiz } from './ElearningUnitModalQuiz';
import { ElearningUnitModalVideo } from './ElearningUnitModalVideo';

interface ElearningUnitModalProps {
  elearningUnit: ElearningUnit;
}

enum ElearningUnitModalMode {
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
  const [quizAnsweredQuestions, setQuizAnsweredQuestions] = useState<
    Record<string, boolean>
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
  const isCurrentQuestionAnswered = currentQuestion
    ? currentQuestion.id in quizAnsweredQuestions
    : false;
  const isCurrentAnswerCorrect = currentQuestion
    ? !!quizAnsweredQuestions[currentQuestion.id]
    : false;

  const closeModal = () => {
    modal.onClose?.();
  };

  const startQuiz = () => {
    setMode(ElearningUnitModalMode.QUIZ);
    setQuizQuestionIndex(0);
    setQuizSelectedAnswerByQuestionId({});
    setQuizAnsweredQuestions({});
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

      // Étape 1 : révéler l'explication pour la question courante
      if (!isCurrentQuestionAnswered) {
        if (!currentSelectedAnswerId) {
          setQuizError('Sélectionne une réponse pour valider.');
          return;
        }

        setQuizError(null);
        setQuizAnsweredQuestions((prev) => ({
          ...prev,
          [currentQuestion.id]: !!currentSelectedAnswer?.isCorrect,
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

    if (!isCurrentQuestionAnswered) {
      return 'Valider';
    }

    return isLastQuestion ? 'Terminer' : 'Question suivante';
  }, [mode, questions.length, isLastQuestion, isCurrentQuestionAnswered]);

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
      fillHeight={mode === ElearningUnitModalMode.VIDEO}
    >
      <StyledElearningUnitModalContainer>
        <StyledElearningUnitModalHeader>
          <H3 title={elearningUnit.title} />
        </StyledElearningUnitModalHeader>
        <StyledElearningUnitModalBody>
          {mode === ElearningUnitModalMode.QUIZ && (
            <ElearningUnitModalQuiz
              questions={questions}
              quizQuestionIndex={quizQuestionIndex}
              currentQuestion={currentQuestion}
              currentSelectedAnswerId={currentSelectedAnswerId}
              isCurrentQuestionAnswered={isCurrentQuestionAnswered}
              isCurrentAnswerCorrect={isCurrentAnswerCorrect}
              hasError={!!quizError}
              onAnswerChange={onQuizAnswerChange}
            />
          )}
          {mode === ElearningUnitModalMode.VIDEO && (
            <ElearningUnitModalVideo
              title={elearningUnit.title}
              videoUrl={elearningUnit.videoUrl}
            />
          )}
        </StyledElearningUnitModalBody>

        {mode === ElearningUnitModalMode.VIDEO && (
          <StyledInviteToGoToQuiz>
            <H5 title="Regardez la vidéo puis passez au quiz" center />
            <Text center>
              Après avoir visionné la vidéo, cliquez sur "Passer au quiz" pour
              répondre aux questions.
            </Text>
          </StyledInviteToGoToQuiz>
        )}
        <StyledElearningUnitModalActions>
          <Button
            onClick={onConfirm}
            variant="primary"
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
