import { Alert, Tag, TagSize, TagVariant, Text } from '@/src/components/ui';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { H5 } from '@/src/components/ui/Headings';
import { PrettyModal } from '@/src/features/modals/PrettyModal/PrettyModal';
import { StyledOnboardingModalAlertTitleContainer } from '../../onboarding.styles';
import { useOnboarding } from '../../useOnboarding';

export const ConfirmModalStep = () => {
  const { currentOnboardingStep } = useOnboarding(); // Here the current step has already advanced to the next one

  return (
    <PrettyModal
      id="elearning-onboarding-success"
      title="Bravo ! Vous avez terminé la formation"
      subtitle="Vous faites désormais partie des membres engagés d'Entourage Pro."
      submitBtnTxt="Continuer vers l'étape suivante"
    >
      <Alert variant={AlertVariant.Info} icon={null}>
        <StyledOnboardingModalAlertTitleContainer>
          <H5
            title={`Prochaine étape : ${currentOnboardingStep?.smallTitle}`}
            noMarginBottom
          />
          <Tag variant={TagVariant.PrimaryBlue} size={TagSize.Small}>
            {currentOnboardingStep?.summary.duration}
          </Tag>
        </StyledOnboardingModalAlertTitleContainer>
        {currentOnboardingStep?.summary.description && (
          <Text>{currentOnboardingStep?.summary.description}</Text>
        )}
      </Alert>
    </PrettyModal>
  );
};
