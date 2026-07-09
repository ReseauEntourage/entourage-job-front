import { Text, Alert, LucidIcon } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { Radio } from '@/src/components/ui/Inputs';
import { ProgressBar } from '@/src/components/ui/ProgressBar/ProgressBar';
import { ElearningQuestion } from '../elearning.types';
import {
  StyledElearningQuestionCard,
  StyledElearningUnitContent,
} from './ElearningUnit.styles';
import { ElearningUnitQuizSuccess } from './ElearningUnitQuizSuccess';

interface ElearningUnitQuizProps {
  questions: ElearningQuestion[];
  quizQuestionIndex: number;
  currentQuestion?: ElearningQuestion;
  currentSelectedAnswerId?: string;
  isCurrentQuestionAnswered: boolean;
  isCurrentAnswerCorrect: boolean;
  hasError: boolean;
  onAnswerChange: (answerId: string) => void;
}

export const ElearningUnitQuiz = ({
  questions,
  quizQuestionIndex,
  currentQuestion,
  currentSelectedAnswerId,
  isCurrentQuestionAnswered,
  isCurrentAnswerCorrect,
  hasError,
  onAnswerChange,
}: ElearningUnitQuizProps) => {
  const progressValue = Math.round(
    (quizQuestionIndex / questions.length) * 100
  );

  const correctAnswer = currentQuestion?.answers.find(
    (answer) => answer.isCorrect
  );

  return (
    <StyledElearningUnitContent noPadding>
      {!isCurrentQuestionAnswered && (
        <StyledElearningQuestionCard>
          <ProgressBar value={progressValue} color="darkBlue" />
          <Text color="darkBlue" weight="semibold">
            Question {quizQuestionIndex + 1} / {questions.length}
          </Text>
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
          type={AlertType.Error}
          variant="outlined"
          icon={<LucidIcon name="MessageCircleWarning" size={24} />}
        >
          <Text weight="semibold">Sélectionne une réponse pour valider.</Text>
        </Alert>
      )}

      {correctAnswer && isCurrentQuestionAnswered && (
        <ElearningUnitQuizSuccess
          correctAnswer={correctAnswer}
          isCorrect={isCurrentAnswerCorrect}
        />
      )}
    </StyledElearningUnitContent>
  );
};
