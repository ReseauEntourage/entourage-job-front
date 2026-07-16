import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { WizardRunShell } from '@/src/features/wizard/WizardRunShell';
import { useWizard } from '@/src/features/wizard/useWizard';

const WizardRun = () => {
  const {
    allSteps,
    currentStepIdx,
    currentStep,
    isLoading,
    isInitializing,
    buttonLabel,
    onNext,
    onBack,
    canGoBack,
    sidePanelContent,
    mobileBottomSheet,
  } = useWizard();

  return (
    <Layout title="Inscription — Entourage Pro" noFooter noHeader>
      <WizardRunShell
        wizardSteps={allSteps}
        currentWizardIdx={currentStepIdx}
        currentStep={currentStep}
        isLoading={isLoading}
        isInitializing={isInitializing}
        buttonLabel={buttonLabel}
        onNext={onNext}
        onBack={onBack}
        canGoBack={canGoBack}
        sidePanelContent={sidePanelContent}
        mobileBottomSheet={mobileBottomSheet}
      />
    </Layout>
  );
};

export default WizardRun;
