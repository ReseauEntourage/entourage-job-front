import React, { useMemo } from 'react';
import { Section, Button, Alert } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { Spinner } from '@/src/components/ui/Spinner';
import { StyledOnboardingActions } from '@/src/features/wizard/onboarding/onboarding.styles';
import { WizardContentLayout } from '@/src/features/wizard/shell/WizardContentLayout';
import { StyledWizardStepHeader } from '@/src/features/wizard/shell/WizardContentLayout.styles';
import { WizardProgressBar } from '@/src/features/wizard/shell/WizardProgressBar';
import {
  WIZARD_SECTIONS,
  WizardStep,
} from '@/src/features/wizard/shell/wizard.types';
import { HeaderWizardStep } from './components/HeaderWizardStep/HeaderWizardStep';

interface WizardRunShellProps {
  wizardSteps: WizardStep[];
  currentWizardIdx: number;
  currentStep: WizardStep | null;
  isLoading: boolean;
  buttonLabel: string;
  onNext: () => Promise<void>;
  onBack?: () => void;
  canGoBack?: boolean;
  isInitializing?: boolean;
  sidePanelContent?: (mode: 'compact' | 'full') => React.ReactNode;
  mobileBottomSheet?: boolean;
}

export const WizardRunShell = ({
  wizardSteps,
  currentWizardIdx,
  currentStep,
  isLoading,
  buttonLabel,
  onNext,
  onBack,
  canGoBack = false,
  isInitializing = false,
  sidePanelContent,
  mobileBottomSheet = false,
}: WizardRunShellProps) => {
  const subProgress = useMemo(() => {
    const currentSectionId = wizardSteps[currentWizardIdx]?.section;
    if (!currentSectionId) {
      return null;
    }
    const section = WIZARD_SECTIONS.find((s) => s.id === currentSectionId);
    if (!section) {
      return null;
    }
    const sectionSteps = wizardSteps.filter(
      (s) => s.section === currentSectionId
    );
    const posInSection = sectionSteps.findIndex(
      (s) => s === wizardSteps[currentWizardIdx]
    );
    return {
      sectionLabel: section.label,
      currentInSection: posInSection,
      totalInSection: sectionSteps.length,
    };
  }, [wizardSteps, currentWizardIdx]);

  const sectionProgress = useMemo(() => {
    if (!subProgress || subProgress.totalInSection <= 1) {
      return null;
    }
    return Math.round(
      ((subProgress.currentInSection + 1) / subProgress.totalInSection) * 100
    );
  }, [subProgress]);

  return (
    <WizardContentLayout
      sidePanel={sidePanelContent ?? null}
      mobileBottomSheet={mobileBottomSheet}
      sectionProgress={sectionProgress}
      stepper={
        <WizardProgressBar
          steps={wizardSteps}
          currentIdx={currentWizardIdx}
          sections={WIZARD_SECTIONS}
        />
      }
    >
      {currentStep && !currentStep.hideGenericStepHeader && (
        <StyledWizardStepHeader>
          <Section className="custom-page">
            <>
              <HeaderWizardStep
                subProgress={subProgress}
                title={currentStep.title}
                description={currentStep.description}
              />
            </>
          </Section>
        </StyledWizardStepHeader>
      )}
      <Section className="custom-header">
        {isInitializing ? (
          <Spinner />
        ) : currentStep ? (
          <>
            <React.Fragment key={currentWizardIdx}>
              {currentStep.content}
            </React.Fragment>
            {!currentStep.hideGenericStepFooter && (
              <StyledOnboardingActions>
                {canGoBack && onBack && (
                  <Button
                    variant="secondary"
                    onClick={onBack}
                    disabled={isLoading}
                    size="large"
                    dataTestId="wizard-back-step-btn"
                  >
                    Retour
                  </Button>
                )}
                <Button
                  onClick={onNext}
                  disabled={isLoading || currentStep?.isNextEnabled === false}
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
            )}
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
