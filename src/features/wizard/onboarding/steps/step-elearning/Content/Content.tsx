import { Button } from '@/src/components/ui';
import { Spinner } from '@/src/components/ui/Spinner';
import { ElearningUnitQuiz } from '@/src/features/backoffice/elearning/elearning-unit/ElearningUnitQuiz';
import { ElearningUnitVideo } from '@/src/features/backoffice/elearning/elearning-unit/ElearningUnitVideo';
import { useElearningQuiz } from '@/src/features/backoffice/elearning/elearning-unit/useElearningQuiz';
import { ElearningUnit } from '@/src/features/backoffice/elearning/elearning.types';
import { StyledOnboardingStepContainer } from '../../../onboarding.styles';
import {
  StyledElearningStepMobileVideo,
  StyledElearningStepModuleActions,
  StyledElearningStepModuleContainer,
} from './Content.styles';
import { ElearningStepIntro } from './ElearningStepIntro';

export type ElearningStepPhase = 'intro' | 'module';

interface ContentProps {
  phase: ElearningStepPhase;
  currentUnit: ElearningUnit | undefined;
  quiz: ReturnType<typeof useElearningQuiz>;
  isDesktop: boolean;
  onStart: () => void;
  onSkip: () => void;
}

export const Content = ({
  phase,
  currentUnit,
  quiz,
  isDesktop,
  onStart,
  onSkip,
}: ContentProps) => {
  if (phase === 'intro') {
    return (
      <StyledOnboardingStepContainer>
        <ElearningStepIntro onStart={onStart} onSkip={onSkip} />
      </StyledOnboardingStepContainer>
    );
  }

  if (!currentUnit) {
    return (
      <StyledOnboardingStepContainer>
        <Spinner />
      </StyledOnboardingStepContainer>
    );
  }

  return (
    <StyledOnboardingStepContainer>
      <StyledElearningStepModuleContainer>
        {!isDesktop && (
          <StyledElearningStepMobileVideo>
            <ElearningUnitVideo
              title={currentUnit.title}
              videoUrl={currentUnit.videoUrl}
            />
          </StyledElearningStepMobileVideo>
        )}

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
        <StyledElearningStepModuleActions>
          <Button onClick={quiz.confirm} variant="primary">
            {quiz.buttonText}
          </Button>
        </StyledElearningStepModuleActions>
      </StyledElearningStepModuleContainer>
    </StyledOnboardingStepContainer>
  );
};
