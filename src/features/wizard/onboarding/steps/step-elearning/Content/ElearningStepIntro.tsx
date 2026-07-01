import { Button } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { StyledElearningStepIntroActions } from './Content.styles';

interface ElearningStepIntroProps {
  onStart: () => void;
  onSkip: () => void;
}

export const ElearningStepIntro = ({
  onStart,
  onSkip,
}: ElearningStepIntroProps) => {
  return (
    <div>
      <StyledElearningStepIntroActions>
        <Button onClick={onStart} variant="primary" size="large">
          Commencer la formation
        </Button>
        <Button onClick={onSkip} variant="text">
          Plus tard
        </Button>
      </StyledElearningStepIntroActions>
    </div>
  );
};
