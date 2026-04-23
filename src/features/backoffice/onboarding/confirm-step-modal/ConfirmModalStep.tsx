import { Alert, Tag, TagSize, TagVariant, Text } from '@/src/components/ui';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { H5 } from '@/src/components/ui/Headings';
import { PrettyModal } from '@/src/features/modals/PrettyModal/PrettyModal';
import { StyledOnboardingModalAlertTitleContainer } from '../onboarding.styles';
import { useOnboarding } from '../useOnboarding';

interface ConfirmModalStepProps {
  id?: string;
  title: string;
  subtitle: string;
  submitBtnTxt: string;
  onSubmit?: () => void;
}

export const ConfirmModalStep = ({
  id = 'confirm-modal-step',
  title,
  subtitle,
  submitBtnTxt,
  onSubmit,
}: ConfirmModalStepProps) => {
  const { nextOnboardingStep } = useOnboarding();

  return (
    <PrettyModal
      id={id}
      title={title}
      subtitle={subtitle}
      submitBtnTxt={submitBtnTxt}
      onSubmit={onSubmit}
    >
      {nextOnboardingStep && (
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
      )}
    </PrettyModal>
  );
};
