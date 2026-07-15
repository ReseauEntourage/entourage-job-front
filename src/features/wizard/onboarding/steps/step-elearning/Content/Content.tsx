import { Alert, Button } from '@/src/components/ui';
import { Spinner } from '@/src/components/ui/Spinner';
import { UserRoles } from '@/src/constants/users';
import { ElearningUnitQuiz } from '@/src/features/backoffice/elearning/elearning-unit/ElearningUnitQuiz';
import { ElearningUnitVideo } from '@/src/features/backoffice/elearning/elearning-unit/ElearningUnitVideo';
import { useElearningQuiz } from '@/src/features/backoffice/elearning/elearning-unit/useElearningQuiz';
import { ElearningUnit } from '@/src/features/backoffice/elearning/elearning.types';
import { ElearningSkipConfirmationModal } from '@/src/features/modals/ElearningSkipConfirmationModal/ElearningSkipConfirmationModal';
import { openModal } from '@/src/features/modals/Modal/openModal';
import { StyledOnboardingStepContainer } from '../../../onboarding.styles';
import {
  StyledElearningStepMobileVideo,
  StyledElearningStepModuleActions,
  StyledElearningStepModuleContainer,
  StyledElearningStepSkipContainer,
} from './Content.styles';

interface ContentProps {
  currentUnit: ElearningUnit | undefined;
  quiz: ReturnType<typeof useElearningQuiz>;
  isDesktop: boolean;
  userRole: UserRoles | undefined;
  onSkip: () => void;
  hasStartedCurrentVideo: boolean;
  onVideoPlay: () => void;
}

export const Content = ({
  currentUnit,
  quiz,
  isDesktop,
  userRole,
  onSkip,
  hasStartedCurrentVideo,
  onVideoPlay,
}: ContentProps) => {
  if (!currentUnit) {
    return (
      <StyledOnboardingStepContainer>
        <Spinner />
      </StyledOnboardingStepContainer>
    );
  }

  const handleSkipClick = () => {
    openModal(
      <ElearningSkipConfirmationModal
        userRole={userRole}
        onConfirmSkip={onSkip}
      />
    );
  };

  return (
    <StyledOnboardingStepContainer>
      <StyledElearningStepModuleContainer>
        {!isDesktop && (
          <StyledElearningStepMobileVideo>
            <ElearningUnitVideo
              title={currentUnit.title}
              videoUrl={currentUnit.videoUrl}
              onPlay={onVideoPlay}
            />
          </StyledElearningStepMobileVideo>
        )}

        {hasStartedCurrentVideo ? (
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
        ) : (
          <Alert variant="dashed">
            {isDesktop
              ? "Regardez la vidéo à droite. Les questions s'afficheront ici juste après."
              : "Regardez la vidéo ci-dessus. Les questions s'afficheront ici juste après."}
          </Alert>
        )}
        {hasStartedCurrentVideo && (
          <StyledElearningStepModuleActions>
            <Button onClick={quiz.confirm} variant="primary">
              {quiz.buttonText}
            </Button>
          </StyledElearningStepModuleActions>
        )}
        {!quiz.currentSelectedAnswerId && (
          <StyledElearningStepSkipContainer>
            <Button onClick={handleSkipClick} variant="text">
              Passer la formation
            </Button>
          </StyledElearningStepSkipContainer>
        )}
      </StyledElearningStepModuleContainer>
    </StyledOnboardingStepContainer>
  );
};
