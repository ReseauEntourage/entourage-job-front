import { Alert, Tag, TagSize, TagVariant, Text } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { H5 } from '@/src/components/ui/Headings';
import { PrettyModal } from '@/src/features/modals/PrettyModal/PrettyModal';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';
import { StyledOnboardingModalAlertTitleContainer } from '../onboarding.styles';

interface ConfirmModalStepProps {
  id?: string;
  title: string;
  subtitle: string;
  submitBtnTxt: string;
  onSubmit?: () => void;
  nextStep?: WizardStep | null;
}

export const ConfirmModalStep = ({
  id = 'confirm-modal-step',
  title,
  subtitle,
  submitBtnTxt,
  onSubmit,
  nextStep,
}: ConfirmModalStepProps) => {
  return (
    <PrettyModal
      id={id}
      title={title}
      subtitle={subtitle}
      submitBtnTxt={submitBtnTxt}
      onSubmit={onSubmit}
    >
      {nextStep && (
        <Alert type={AlertType.Info} icon={null} variant="outlined">
          <StyledOnboardingModalAlertTitleContainer>
            <H5
              title={`Prochaine étape : ${nextStep.smallTitle}`}
              noMarginBottom
            />
            <Tag variant={TagVariant.PrimaryBlue} size={TagSize.Small}>
              {nextStep.summary.duration}
            </Tag>
          </StyledOnboardingModalAlertTitleContainer>
          {nextStep.summary.description && (
            <Text>{nextStep.summary.description}</Text>
          )}
        </Alert>
      )}
    </PrettyModal>
  );
};
