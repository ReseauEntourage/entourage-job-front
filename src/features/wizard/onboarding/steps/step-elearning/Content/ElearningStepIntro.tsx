import { Button } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { StyledActionsContainer } from './ElearningStepIntro.styles';

interface ElearningStepIntroProps {
  onStart: () => void;
  onSkip: () => void;
}

export const ElearningStepIntro = ({
  onStart,
  onSkip,
}: ElearningStepIntroProps) => {
  return (
    <>
      <H2 title="Dernière étape avant de découvrir qui soutenir : une courte formation en vidéos et quelques questions. C’est rapide, et ça compte pour bien démarrer 🙂" />
      <StyledActionsContainer>
        <Button onClick={onStart} variant="primary" size="large">
          Commencer la formation
        </Button>
        <Button onClick={onSkip} variant="text">
          Plus tard
        </Button>
      </StyledActionsContainer>
    </>
  );
};
