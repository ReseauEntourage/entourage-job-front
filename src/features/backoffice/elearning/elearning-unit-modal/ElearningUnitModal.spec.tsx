import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { useElearning } from '../useElearning';
import { ElearningUnitModal } from './ElearningUnitModal';

const mockOnClose = jest.fn();
jest.mock('@/src/features/modals/Modal', () => ({
  Modal: ({ id, children, fillHeight }: any) => (
    <div data-testid="modal" data-id={id} data-fill={String(fillHeight)}>
      {children}
    </div>
  ),
  useModalContext: () => ({ onClose: mockOnClose }),
}));
jest.mock('../useElearning', () => ({ useElearning: jest.fn() }));
jest.mock('../elearning-unit/ElearningUnitVideo', () => ({
  ElearningUnitVideo: ({ title, videoUrl }: any) => (
    <div data-testid="video">{`${title}|${videoUrl}`}</div>
  ),
}));
jest.mock('../elearning-unit/ElearningUnitQuiz', () => ({
  ElearningUnitQuiz: ({ currentQuestion, onAnswerChange, hasError }: any) => (
    <div data-testid="quiz">
      <span>{currentQuestion?.id}</span>
      <span data-testid="error">{String(hasError)}</span>
      <button onClick={() => onAnswerChange('a1')}>pick-correct</button>
    </div>
  ),
}));

const unit = (questions?: any[]) =>
  ({
    id: 'u1',
    title: 'Unité 1',
    videoUrl: 'https://youtube.com/watch?v=x',
    questions,
  }) as any;

const question = {
  id: 'q1',
  answers: [{ id: 'a1', isCorrect: true }],
};

describe('ElearningUnitModal', () => {
  const completeUnit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useElearning as jest.Mock).mockReturnValue({ completeUnit });
  });

  it('starts on the video with a call to action to move on to the quiz', () => {
    render(<ElearningUnitModal elearningUnit={unit([question])} />);

    expect(screen.getByTestId('modal')).toHaveAttribute(
      'data-id',
      'elearning-unit-modal-u1'
    );
    expect(screen.getByTestId('modal')).toHaveAttribute('data-fill', 'true');
    expect(screen.getByText('Unité 1')).toBeInTheDocument();
    expect(screen.getByTestId('video')).toHaveTextContent(
      'Unité 1|https://youtube.com/watch?v=x'
    );
    expect(
      screen.getByText('Regardez la vidéo puis passez au quiz')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('quiz')).not.toBeInTheDocument();
  });

  it('switches to the quiz on "Passer au quiz"', () => {
    render(<ElearningUnitModal elearningUnit={unit([question])} />);
    fireEvent.click(screen.getByText('Passer au quiz'));

    expect(screen.getByTestId('quiz')).toHaveTextContent('q1');
    expect(screen.queryByTestId('video')).not.toBeInTheDocument();
    expect(screen.getByTestId('modal')).toHaveAttribute('data-fill', 'false');
  });

  it('completes the unit and closes the modal once the whole quiz is answered', () => {
    render(<ElearningUnitModal elearningUnit={unit([question])} />);
    fireEvent.click(screen.getByText('Passer au quiz'));
    fireEvent.click(screen.getByText('pick-correct'));
    // First confirm reveals the explanation, the second one ends the quiz.
    fireEvent.click(
      screen.getByRole('button', {
        name: /^(Valider|Terminer|Question suivante|Confirmer)$/,
      })
    );
    expect(completeUnit).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole('button', {
        name: /^(Valider|Terminer|Question suivante|Confirmer)$/,
      })
    );

    expect(completeUnit).toHaveBeenCalledWith('u1');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('flags an error when validating without selecting an answer', () => {
    render(<ElearningUnitModal elearningUnit={unit([question])} />);
    fireEvent.click(screen.getByText('Passer au quiz'));
    fireEvent.click(
      screen.getByRole('button', {
        name: /^(Valider|Terminer|Question suivante|Confirmer)$/,
      })
    );

    expect(screen.getByTestId('error')).toHaveTextContent('true');
    expect(completeUnit).not.toHaveBeenCalled();
  });

  it('completes directly after the quiz step when the unit has no question', () => {
    render(<ElearningUnitModal elearningUnit={unit(undefined)} />);
    fireEvent.click(screen.getByText('Passer au quiz'));
    fireEvent.click(
      screen.getByRole('button', {
        name: /^(Valider|Terminer|Question suivante|Confirmer)$/,
      })
    );

    expect(completeUnit).toHaveBeenCalledWith('u1');
    expect(mockOnClose).toHaveBeenCalled();
  });
});
