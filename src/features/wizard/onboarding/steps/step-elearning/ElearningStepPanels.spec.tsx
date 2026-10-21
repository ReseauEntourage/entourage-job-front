jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/features/modals/Modal/openModal', () => ({
  openModal: jest.fn(),
}));
jest.mock(
  '@/src/features/modals/ElearningSkipConfirmationModal/ElearningSkipConfirmationModal',
  () => ({
    ElearningSkipConfirmationModal: () => null,
  })
);
jest.mock(
  '@/src/features/backoffice/elearning/elearning-unit/ElearningUnitVideo',
  () => ({
    ElearningUnitVideo: ({ title, videoUrl, onPlay }: any) => (
      <button data-testid="video" onClick={onPlay}>
        {title}|{videoUrl}
      </button>
    ),
  })
);
jest.mock(
  '@/src/features/backoffice/elearning/elearning-unit/ElearningUnitQuiz',
  () => ({
    ElearningUnitQuiz: ({ currentQuestion }: any) => (
      <div data-testid="quiz">{currentQuestion?.title}</div>
    ),
  })
);
jest.mock(
  '@/src/features/wizard/sidepanels/WizardRecommendationsSidePanel',
  () => ({
    WizardRecommendationsSidePanel: () => <div data-testid="recommendations" />,
  })
);

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal/openModal';
import { Content } from './Content/Content';
import { ElearningSidePanel } from './SidePanel/ElearningSidePanel';

const unit = {
  id: 'u1',
  title: 'Unité 1',
  videoUrl: 'https://v.test/1',
} as any;

const quizFor = (overrides: any = {}) =>
  ({
    questions: [],
    quizQuestionIndex: 0,
    currentQuestion: { title: 'Question 1' },
    currentSelectedAnswerId: null,
    isCurrentQuestionAnswered: false,
    isCurrentAnswerCorrect: false,
    hasError: false,
    onAnswerChange: jest.fn(),
    confirm: jest.fn(),
    buttonText: 'Valider',
    ...overrides,
  }) as any;

describe('ElearningSidePanel', () => {
  afterEach(() => cleanup());

  it('shows the recommendations without a current unit', () => {
    render(
      <ElearningSidePanel
        currentUnit={undefined}
        isDesktop
        onVideoPlay={jest.fn()}
        currentUnitPosition={1}
        totalUnits={3}
      />
    );
    expect(screen.getByTestId('recommendations')).toBeInTheDocument();
  });

  it('shows the recommendations on mobile, where the video moves into the content', () => {
    render(
      <ElearningSidePanel
        currentUnit={unit}
        isDesktop={false}
        onVideoPlay={jest.fn()}
        currentUnitPosition={1}
        totalUnits={3}
      />
    );
    expect(screen.getByTestId('recommendations')).toBeInTheDocument();
    expect(screen.queryByTestId('video')).toBeNull();
  });

  it('shows the video of the unit with its position on desktop', () => {
    const onVideoPlay = jest.fn();
    render(
      <ElearningSidePanel
        currentUnit={unit}
        isDesktop
        onVideoPlay={onVideoPlay}
        currentUnitPosition={2}
        totalUnits={3}
      />
    );
    expect(screen.getByText('Formation - Vidéo 2/3')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('video'));
    expect(onVideoPlay).toHaveBeenCalledTimes(1);
  });
});

describe('Elearning step Content', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => cleanup());

  const baseProps = {
    currentUnit: unit,
    quiz: quizFor(),
    isDesktop: true,
    userRole: UserRoles.COACH,
    onSkip: jest.fn(),
    hasStartedCurrentVideo: false,
    onVideoPlay: jest.fn(),
  };

  it('shows a spinner while there is no current unit', () => {
    render(<Content {...baseProps} currentUnit={undefined} />);
    expect(screen.queryByTestId('quiz')).toBeNull();
    expect(screen.queryByText('Suivre la formation plus tard')).toBeNull();
  });

  it('asks to watch the video on the right on desktop before showing the quiz', () => {
    render(<Content {...baseProps} />);
    expect(
      screen.getByText(
        "Regardez la vidéo à droite. Les questions s'afficheront ici juste après."
      )
    ).toBeInTheDocument();
    expect(screen.queryByTestId('quiz')).toBeNull();
    expect(screen.queryByTestId('video')).toBeNull();
  });

  it('shows the video above the quiz on mobile', () => {
    const onVideoPlay = jest.fn();
    render(
      <Content {...baseProps} isDesktop={false} onVideoPlay={onVideoPlay} />
    );
    expect(
      screen.getByText(
        "Regardez la vidéo ci-dessus. Les questions s'afficheront ici juste après."
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('video'));
    expect(onVideoPlay).toHaveBeenCalledTimes(1);
  });

  it('shows the quiz and its confirm button once the video started', () => {
    const quiz = quizFor();
    render(<Content {...baseProps} quiz={quiz} hasStartedCurrentVideo />);
    expect(screen.getByTestId('quiz')).toHaveTextContent('Question 1');
    fireEvent.click(screen.getByText('Valider'));
    expect(quiz.confirm).toHaveBeenCalledTimes(1);
  });

  it('offers to follow the formation later only while no answer is selected', () => {
    const { rerender } = render(<Content {...baseProps} />);
    expect(
      screen.getByText('Suivre la formation plus tard')
    ).toBeInTheDocument();
    rerender(
      <Content
        {...baseProps}
        quiz={quizFor({ currentSelectedAnswerId: 'a1' })}
      />
    );
    expect(screen.queryByText('Suivre la formation plus tard')).toBeNull();
  });

  it('asks for a confirmation before skipping', () => {
    render(<Content {...baseProps} />);
    fireEvent.click(screen.getByText('Suivre la formation plus tard'));
    expect(openModal).toHaveBeenCalledTimes(1);
    const modal = (openModal as jest.Mock).mock.calls[0][0];
    expect(modal.props.userRole).toBe(UserRoles.COACH);
    expect(modal.props.onConfirmSkip).toBe(baseProps.onSkip);
  });
});
