import React from 'react';
import { Section, Button, Alert } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { Spinner } from '@/src/components/ui/Spinner';
import { StyledOnboardingActions } from '@/src/features/backoffice/onboarding/onboarding.styles';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { WizardContentLayout } from '@/src/features/wizard-shell/WizardContentLayout';
import { StyledWizardStepHeader } from '@/src/features/wizard-shell/WizardContentLayout.styles';
import { WizardIndicator } from '@/src/features/wizard-shell/WizardIndicator';
import { WizardProgressBar } from '@/src/features/wizard-shell/WizardProgressBar';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';

interface WizardRunShellProps {
  wizardSteps: WizardStep[];
  currentWizardIdx: number;
  currentStep: WizardStep | null;
  isLoading: boolean;
  buttonLabel: string;
  onNext: () => Promise<void>;
  isInitializing?: boolean;
}

export const WizardRunShell = ({
  wizardSteps,
  currentWizardIdx,
  currentStep,
  isLoading,
  buttonLabel,
  onNext,
  isInitializing = false,
}: WizardRunShellProps) => {
  return (
    <WizardContentLayout sidePanel={null}>
      <StyledWizardStepHeader>
        <Section className="custom-page">
          <WizardProgressBar
            steps={wizardSteps}
            currentIdx={currentWizardIdx}
          />
        </Section>
      </StyledWizardStepHeader>
      <StyledWizardStepHeader>
        <Section className="custom-page">
          <WizardIndicator
            totalSteps={wizardSteps.length}
            currentIdx={currentWizardIdx}
          />
          {currentStep && !currentStep.hideGenericStepHeader && (
            <>
              <br />
              <HeaderBackoffice
                title={currentStep.title}
                description={currentStep.description}
              />
            </>
          )}
        </Section>
      </StyledWizardStepHeader>
      <Section className="custom-page">
        {isInitializing ? (
          <Spinner />
        ) : currentStep ? (
          <>
            <React.Fragment key={currentWizardIdx}>
              {currentStep.content}
            </React.Fragment>
            <StyledOnboardingActions>
              <Button
                onClick={onNext}
                disabled={isLoading}
                size="large"
                dataTestId="wizard-next-step-btn"
              >
                {isLoading && (
                  <>
                    <Spinner size={16} color="white" />
                    &nbsp;&nbsp;Chargement...
                  </>
                )}
                {!isLoading && buttonLabel}
              </Button>
            </StyledOnboardingActions>
          </>
        ) : (
          <Alert type={AlertType.Error}>
            Une erreur est survenue. Veuillez recharger la page.
          </Alert>
        )}
      </Section>
    </WizardContentLayout>
  );
};
