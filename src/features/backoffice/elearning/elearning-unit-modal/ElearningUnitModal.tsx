import { useState } from 'react';

import { Button, Text } from '@/src/components/ui';
import { H3, H5 } from '@/src/components/ui/Headings';
import { Modal, useModalContext } from '@/src/features/modals/Modal';
import { ElearningUnitQuiz } from '../elearning-unit/ElearningUnitQuiz';
import { ElearningUnitVideo } from '../elearning-unit/ElearningUnitVideo';
import { useElearningQuiz } from '../elearning-unit/useElearningQuiz';
import { ElearningUnit } from '../elearning.types';
import { useElearning } from '../useElearning';
import {
  StyledElearningUnitModalActions,
  StyledElearningUnitModalContainer,
  StyledElearningUnitModalBody,
  StyledInviteToGoToQuiz,
} from './ElearningUnitModal.styles';

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

  const { completeUnit } = useElearning();
  const modal = useModalContext();

  const closeModal = () => {
    modal.onClose?.();
  };

  const quiz = useElearningQuiz({
    questions: elearningUnit.questions ?? [],
    onComplete: () => {
      completeUnit(elearningUnit.id);
      closeModal();
    },
  });

  const startQuiz = () => {
    setMode(ElearningUnitModalMode.QUIZ);
    quiz.reset();
  };

  const onConfirm = () => {
    if (mode === ElearningUnitModalMode.VIDEO) {
      startQuiz();
      return;
    }
    quiz.confirm();
  };

  const buttonText =
    mode === ElearningUnitModalMode.VIDEO ? 'Passer au quiz' : quiz.buttonText;

  return (
    <Modal
      id={`elearning-unit-modal-${elearningUnit.id}`}
      size="large"
      withCloseButton
      fillHeight={mode === ElearningUnitModalMode.VIDEO}
    >
      <StyledElearningUnitModalContainer>
        <H3 title={elearningUnit.title} />
        <StyledElearningUnitModalBody>
          {mode === ElearningUnitModalMode.QUIZ && (
            <ElearningUnitQuiz
              questions={quiz.questions}
              quizQuestionIndex={quiz.quizQuestionIndex}
              currentQuestion={quiz.currentQuestion}
              currentSelectedAnswerId={quiz.currentSelectedAnswerId}
              isCurrentQuestionAnswered={quiz.isCurrentQuestionAnswered}
              isCurrentAnswerCorrect={quiz.isCurrentAnswerCorrect}
              hasError={quiz.hasError}
              onAnswerChange={quiz.onAnswerChange}
            />
          )}
          {mode === ElearningUnitModalMode.VIDEO && (
            <ElearningUnitVideo
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
