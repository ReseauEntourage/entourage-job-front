import { useCallback, useMemo, useState } from 'react';
import { ElearningQuestion } from '../elearning.types';

interface UseElearningQuizOptions {
  questions: ElearningQuestion[];
  onComplete: () => void;
}

export const useElearningQuiz = ({
  questions,
  onComplete,
}: UseElearningQuizOptions) => {
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizSelectedAnswerByQuestionId, setQuizSelectedAnswerByQuestionId] =
    useState<Record<string, string>>({});
  const [quizAnsweredQuestions, setQuizAnsweredQuestions] = useState<
    Record<string, boolean>
  >({});
  const [quizError, setQuizError] = useState<string | null>(null);

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

  const reset = useCallback(() => {
    setQuizQuestionIndex(0);
    setQuizSelectedAnswerByQuestionId({});
    setQuizAnsweredQuestions({});
    setQuizError(null);
  }, []);

  const confirm = useCallback(() => {
    if (questions.length === 0) {
      onComplete();
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

    onComplete();
  }, [
    questions.length,
    currentQuestion,
    isCurrentQuestionAnswered,
    currentSelectedAnswerId,
    currentSelectedAnswer,
    isLastQuestion,
    onComplete,
  ]);

  const onAnswerChange = useCallback(
    (answerId: string) => {
      if (!currentQuestion) {
        return;
      }

      setQuizError(null);
      setQuizSelectedAnswerByQuestionId((prev) => ({
        ...prev,
        [currentQuestion.id]: answerId,
      }));
    },
    [currentQuestion]
  );

  const buttonText = useMemo(() => {
    if (questions.length === 0) {
      return 'Confirmer';
    }

    if (!isCurrentQuestionAnswered) {
      return 'Valider';
    }

    return isLastQuestion ? 'Terminer' : 'Question suivante';
  }, [questions.length, isLastQuestion, isCurrentQuestionAnswered]);

  return {
    questions,
    quizQuestionIndex,
    currentQuestion,
    currentSelectedAnswerId,
    isCurrentQuestionAnswered,
    isCurrentAnswerCorrect,
    hasError: !!quizError,
    buttonText,
    onAnswerChange,
    confirm,
    reset,
  };
};
