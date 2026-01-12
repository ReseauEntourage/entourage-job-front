import { useRouter } from 'next/router';
import { Text, LucidIcon, Button } from '@/src/components/ui';
import { H4, H5 } from '@/src/components/ui/Headings';
import { TimeLineVertical } from '@/src/components/ui/TimeLines/TimeLineVertical';
import { useOnboarding } from '@/src/hooks/useOnboarding';
import { StyledActionContainer } from './StepsSummary.styles';

export const StepsSummary = () => {
  const { onboardingSteps, totalDuration } = useOnboarding();
  const router = useRouter();

  const runOnboarding = () => {
    router.push('/backoffice/onboarding/run');
  };

  return (
    <>
      <H4
        title={`Votre parcours d'intégration : ${onboardingSteps.length} étapes essentielles`}
      />
      <Text>
        Un parcours structuré pour vous permettre de comprendre votre rôle et
        vos missions, comprendre les outils et intégrer la communauté.
      </Text>

      <br />

      <TimeLineVertical.Container style={{ marginTop: '25px' }}>
        {onboardingSteps.map((step, index) => (
          <TimeLineVertical.Item
            key={index}
            number={index + 1}
            isLast={index === onboardingSteps.length - 1}
          >
            <H5 title={step.summary.title} noMarginBottom />
            <Text>{step.summary.description}</Text>
            <Text>
              <LucidIcon name="Clock" size={16} /> Durée estimée :{' '}
              {step.summary.duration}
            </Text>
          </TimeLineVertical.Item>
        ))}
      </TimeLineVertical.Container>

      <StyledActionContainer>
        <Button onClick={runOnboarding}>Commencer le parcours</Button>
        <Text>
          <LucidIcon name="Clock" size={16} /> Durée totale : ~{totalDuration}{' '}
          minutes
        </Text>
      </StyledActionContainer>
    </>
  );
};
