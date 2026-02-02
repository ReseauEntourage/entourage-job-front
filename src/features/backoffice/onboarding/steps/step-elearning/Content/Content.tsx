import { Skeleton } from '@/src/components/ui/Skeleton/Skeleton';
import { ElearningProgressTracker } from '@/src/features/backoffice/elearning/elearning-progress-tracker/ElearningProgressTracker';
import { useElearning } from '@/src/features/backoffice/elearning/useElearning';
import { ElearningUnitCard } from '../../../../elearning/elearning-unit-card/ElearningUnitCard';
import { StyledOnboardingStepContainer } from '../../../onboarding.styles';
import { StyledOnboardingElearningUnitCardList } from './Content.styles';

export const Content = () => {
  const { isLoading, elearningUnits } = useElearning();

  return (
    <StyledOnboardingStepContainer>
      <ElearningProgressTracker />
      <StyledOnboardingElearningUnitCardList>
        {isLoading && <Skeleton height="130px" width="100%" count={4} />}
        {!isLoading &&
          elearningUnits &&
          elearningUnits.map((unit, idx) => (
            <ElearningUnitCard key={unit.id} idx={idx} elearningUnit={unit} />
          ))}
      </StyledOnboardingElearningUnitCardList>
    </StyledOnboardingStepContainer>
  );
};
