import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { WizardRunShell } from '@/src/features/registration-wizard/WizardRunShell';
import { useWizard } from '@/src/features/registration-wizard/useWizard';

const WizardRun = () => {
  const {
    allSteps,
    currentStepIdx,
    currentStep,
    isLoading,
    isInitializing,
    buttonLabel,
    onNext,
  } = useWizard();

  return (
    <Layout title="Inscription — Entourage Pro" noFooter>
      <WizardRunShell
        wizardSteps={allSteps}
        currentWizardIdx={currentStepIdx}
        currentStep={currentStep}
        isLoading={isLoading}
        isInitializing={isInitializing}
        buttonLabel={buttonLabel}
        onNext={onNext}
      />
    </Layout>
  );
};

export default WizardRun;
