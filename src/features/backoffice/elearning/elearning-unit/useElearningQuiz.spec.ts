import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ElearningQuestion } from '../elearning.types';
import { useElearningQuiz } from './useElearningQuiz';

const questions: ElearningQuestion[] = [
  {
    id: 'q1',
    unitId: 'u',
    label: 'Q1',
    answers: [
      {
        id: 'a1',
        questionId: 'q1',
        label: 'Good',
        isCorrect: true,
        explanation: null,
      },
      {
        id: 'a2',
        questionId: 'q1',
        label: 'Bad',
        isCorrect: false,
        explanation: null,
      },
    ],
  },
  {
    id: 'q2',
    unitId: 'u',
    label: 'Q2',
    answers: [
      {
        id: 'b1',
        questionId: 'q2',
        label: 'Good',
        isCorrect: true,
        explanation: null,
      },
    ],
  },
];

describe('useElearningQuiz', () => {
  it('completes straight away without question', () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() =>
      useElearningQuiz({ questions: [], onComplete })
    );
    expect(result.current.buttonText).toBe('Confirmer');
    act(() => result.current.confirm());
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('asks for an answer before validating', () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() =>
      useElearningQuiz({ questions, onComplete })
    );
    expect(result.current.buttonText).toBe('Valider');
    act(() => result.current.confirm());
    expect(result.current.hasError).toBe(true);
    expect(result.current.isCurrentQuestionAnswered).toBe(false);
    // choosing an answer clears the error
    act(() => result.current.onAnswerChange('a1'));
    expect(result.current.hasError).toBe(false);
    expect(result.current.currentSelectedAnswerId).toBe('a1');
  });

  it('reveals a correct answer then moves to the next question', () => {
    const { result } = renderHook(() =>
      useElearningQuiz({ questions, onComplete: jest.fn() })
    );
    act(() => result.current.onAnswerChange('a1'));
    act(() => result.current.confirm());
    expect(result.current.isCurrentQuestionAnswered).toBe(true);
    expect(result.current.isCurrentAnswerCorrect).toBe(true);
    expect(result.current.buttonText).toBe('Question suivante');
    act(() => result.current.confirm());
    expect(result.current.quizQuestionIndex).toBe(1);
    expect(result.current.currentQuestion?.id).toBe('q2');
    expect(result.current.isCurrentQuestionAnswered).toBe(false);
  });

  it('flags a wrong answer and still lets the user continue', () => {
    const { result } = renderHook(() =>
      useElearningQuiz({ questions, onComplete: jest.fn() })
    );
    act(() => result.current.onAnswerChange('a2'));
    act(() => result.current.confirm());
    expect(result.current.isCurrentQuestionAnswered).toBe(true);
    expect(result.current.isCurrentAnswerCorrect).toBe(false);
    act(() => result.current.confirm());
    expect(result.current.quizQuestionIndex).toBe(1);
  });

  it('completes after the last question is revealed', () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() =>
      useElearningQuiz({ questions, onComplete })
    );
    act(() => result.current.onAnswerChange('a1'));
    act(() => result.current.confirm());
    act(() => result.current.confirm());
    act(() => result.current.onAnswerChange('b1'));
    act(() => result.current.confirm());
    expect(result.current.buttonText).toBe('Terminer');
    expect(onComplete).not.toHaveBeenCalled();
    act(() => result.current.confirm());
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('resets the whole quiz', () => {
    const { result } = renderHook(() =>
      useElearningQuiz({ questions, onComplete: jest.fn() })
    );
    act(() => result.current.onAnswerChange('a1'));
    act(() => result.current.confirm());
    act(() => result.current.confirm());
    act(() => result.current.reset());
    expect(result.current.quizQuestionIndex).toBe(0);
    expect(result.current.currentSelectedAnswerId).toBeUndefined();
    expect(result.current.isCurrentQuestionAnswered).toBe(false);
    expect(result.current.hasError).toBe(false);
  });
});
