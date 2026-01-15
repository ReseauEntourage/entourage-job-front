import { Alert, Tag, TagSize, TagVariant, Text } from '@/src/components/ui';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { H5 } from '@/src/components/ui/Headings';
import { PrettyModal } from '@/src/features/modals/PrettyModal/PrettyModal';
import { StyledOnboardingModalAlertTitleContainer } from '../onboarding.styles';
import { useOnboarding } from '../useOnboarding';

export interface ConfirmModalStepProps {
  title: string;
  subtitle: string;
  submitBtnTxt: string;
  onSubmit?: () => void;
}

export const ConfirmModalStep = ({
  title,
  subtitle,
  submitBtnTxt,
  onSubmit,
}: ConfirmModalStepProps) => {
  const { nextOnboardingStep } = useOnboarding();

  return (
    <PrettyModal
      id="social-situation-onboarding-success"
      title={title}
      subtitle={subtitle}
      submitBtnTxt={submitBtnTxt}
      onSubmit={onSubmit}
    >
      <Alert variant={AlertVariant.Info} icon={null}>
        <StyledOnboardingModalAlertTitleContainer>
          <H5
            title={`Prochaine étape : ${nextOnboardingStep?.smallTitle}`}
            noMarginBottom
          />
          <Tag variant={TagVariant.PrimaryBlue} size={TagSize.Small}>
            {nextOnboardingStep?.summary.duration}
          </Tag>
        </StyledOnboardingModalAlertTitleContainer>
        {nextOnboardingStep?.summary.description && (
          <Text>{nextOnboardingStep?.summary.description}</Text>
        )}
      </Alert>
    </PrettyModal>
  );
};
