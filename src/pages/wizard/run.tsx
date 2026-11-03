import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { WizardRunShell } from '@/src/features/wizard/WizardRunShell';
import { getValidRequestedPath } from '@/src/features/wizard/onboarding/onboardingExitPath';
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
    isOnboardingPhase,
    skippedSectionIds,
  } = useWizard();
  const router = useRouter();
  // Sent here from a backoffice page while the onboarding is not completed
  // (see useOnboardingRedirect): explain why.
  const showOnboardingGateNotice =
    !!isOnboardingPhase &&
    getValidRequestedPath(router?.query?.requestedPath) !== null;

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
        isOnboardingPhase={isOnboardingPhase}
        showOnboardingGateNotice={showOnboardingGateNotice}
        skippedSectionIds={skippedSectionIds}
      />
    </Layout>
  );
};

export default WizardRun;
