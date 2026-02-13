import { Text, Alert, LucidIcon } from '@/src/components/ui';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { H5 } from '@/src/components/ui/Headings';
import { Radio } from '@/src/components/ui/Inputs';
import { ProgressBar } from '@/src/components/ui/ProgressBar/ProgressBar';
import { ElearningQuestion } from '../elearning.types';
import {
  StyledElearningQuestionCard,
  StyledElearningUnitModalContent,
  StyledQuestionHeader,
} from './ElearningUnitModal.styles';
import { ElearningUnitModalQuizSuccess } from './ElearningUnitModalQuizSuccess';

export interface ElearningUnitModalQuizProps {
  questions: ElearningQuestion[];
  quizQuestionIndex: number;
  currentQuestion?: ElearningQuestion;
  currentSelectedAnswerId?: string;
  isCurrentQuestionValidatedCorrect: boolean;
  hasError: boolean;
  onAnswerChange: (answerId: string) => void;
}

export const ElearningUnitModalQuiz = ({
  questions,
  quizQuestionIndex,
  currentQuestion,
  currentSelectedAnswerId,
  isCurrentQuestionValidatedCorrect,
  hasError,
  onAnswerChange,
}: ElearningUnitModalQuizProps) => {
  const progressValue = Math.round(
    (quizQuestionIndex / questions.length) * 100
  );

  const correctAnswer = currentQuestion?.answers.find(
    (answer) => answer.isCorrect
  );

  return (
    <StyledElearningUnitModalContent>
      <StyledQuestionHeader>
        <H5 title="Quiz de validation" />
        <Text color="darkGray">
          Question {quizQuestionIndex + 1} / {questions.length}
        </Text>
      </StyledQuestionHeader>

      <ProgressBar value={progressValue} color="darkBlue" />

      {!isCurrentQuestionValidatedCorrect && (
        <StyledElearningQuestionCard>
          <Text size="large" weight="semibold">
            {currentQuestion?.label}
          </Text>
          {currentQuestion && (
            <Radio
              id={`elearning-quiz-question-${currentQuestion.id}`}
              name={`elearning-quiz-question-${currentQuestion.id}`}
              options={currentQuestion.answers.map((answer) => ({
                inputId: `elearning-quiz-answer-${answer.id}`,
                value: answer.id,
                label: answer.label,
              }))}
              value={currentSelectedAnswerId ?? ''}
              onChange={onAnswerChange}
            />
          )}
        </StyledElearningQuestionCard>
      )}

      {hasError && (
        <Alert
          variant={AlertVariant.Error}
          icon={<LucidIcon name="MessageCircleWarning" size={24} />}
        >
          <Text color="white" weight="semibold">
            Réponse incorrecte
          </Text>
          <Text color="white">Veuillez réessayer avec une autre réponse</Text>
        </Alert>
      )}

      {correctAnswer && isCurrentQuestionValidatedCorrect && (
        <ElearningUnitModalQuizSuccess correctAnswer={correctAnswer} />
      )}
    </StyledElearningUnitModalContent>
  );
};
