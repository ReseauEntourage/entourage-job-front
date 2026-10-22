import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ElearningQuestion } from '../elearning.types';
import { ElearningUnitQuiz } from './ElearningUnitQuiz';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const questions: ElearningQuestion[] = [
  {
    id: 'q1',
    unitId: 'u',
    label: 'Quelle est la bonne posture ?',
    answers: [
      {
        id: 'a1',
        questionId: 'q1',
        label: 'Écouter',
        isCorrect: true,
        explanation: 'Écouter est la base.',
      },
      {
        id: 'a2',
        questionId: 'q1',
        label: 'Juger',
        isCorrect: false,
        explanation: null,
      },
    ],
  },
  { id: 'q2', unitId: 'u', label: 'Q2', answers: [] },
];

const baseProps = {
  questions,
  quizQuestionIndex: 0,
  currentQuestion: questions[0],
  currentSelectedAnswerId: undefined,
  isCurrentQuestionAnswered: false,
  isCurrentAnswerCorrect: false,
  hasError: false,
  onAnswerChange: jest.fn(),
};

describe('ElearningUnitQuiz', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the question, its position and its answers', () => {
    render(<ElearningUnitQuiz {...baseProps} />);
    expect(screen.getByText('Question 1 / 2')).toBeInTheDocument();
    expect(
      screen.getByText('Quelle est la bonne posture ?')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Écouter')).toBeInTheDocument();
    expect(screen.getByLabelText('Juger')).toBeInTheDocument();
  });

  it('reports the selected answer', () => {
    render(<ElearningUnitQuiz {...baseProps} />);
    fireEvent.click(screen.getByLabelText('Juger'));
    expect(baseProps.onAnswerChange).toHaveBeenCalledWith('a2');
  });

  it('checks the selected answer', () => {
    render(<ElearningUnitQuiz {...baseProps} currentSelectedAnswerId="a1" />);
    expect(screen.getByLabelText('Écouter')).toBeChecked();
    expect(screen.getByLabelText('Juger')).not.toBeChecked();
  });

  it('asks to select an answer on error', () => {
    render(<ElearningUnitQuiz {...baseProps} hasError />);
    expect(
      screen.getByText('Sélectionne une réponse pour valider.')
    ).toBeInTheDocument();
  });

  it('shows no error by default', () => {
    render(<ElearningUnitQuiz {...baseProps} />);
    expect(
      screen.queryByText('Sélectionne une réponse pour valider.')
    ).toBeNull();
  });

  it('replaces the question by a congratulation and the explanation once answered correctly', () => {
    render(
      <ElearningUnitQuiz
        {...baseProps}
        currentSelectedAnswerId="a1"
        isCurrentQuestionAnswered
        isCurrentAnswerCorrect
      />
    );
    expect(screen.queryByText('Question 1 / 2')).toBeNull();
    expect(screen.getByText('Bonne réponse !')).toBeInTheDocument();
    expect(screen.getByText('Explication :')).toBeInTheDocument();
    expect(screen.getByText('Écouter est la base.')).toBeInTheDocument();
  });

  it('says it was wrong, without explanation when the correct answer has none', () => {
    const noExplanation = {
      ...questions[0],
      answers: questions[0].answers.map((a) => ({ ...a, explanation: null })),
    };
    render(
      <ElearningUnitQuiz
        {...baseProps}
        currentQuestion={noExplanation}
        isCurrentQuestionAnswered
        isCurrentAnswerCorrect={false}
      />
    );
    expect(
      screen.getByText("Ce n'est pas la bonne réponse.")
    ).toBeInTheDocument();
    expect(screen.queryByText('Explication :')).toBeNull();
  });
});
