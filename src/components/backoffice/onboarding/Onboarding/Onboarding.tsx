import React, { useMemo } from 'react';
import { useOnboarding } from '../useOnboarding';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { OnboardingHelpsForm } from './forms/OnboardingHelpsForm';
import { OnboardingJobForm } from './forms/OnboardingJobForm';
import { OnboardingProfileForm } from './forms/OnboardingProfileForm';

export const Onboarding = () => {
  const {
    onboardingCurrentStep,
    onSubmitLastStepOnboarding,
    onSubmitFirstSecondStepOnboarding,
    onBeforeStep,
  } = useOnboarding();

  const modals = useMemo(() => {
    if (!onSubmitFirstSecondStepOnboarding || !onSubmitLastStepOnboarding) {
      return null;
    }
    return [
      {
        // if step = 0, no modal
        text: {},
        content: null,
      },
      {
        text: {
          title: 'A vous de jouer',
          description: 'Sélectionnez le ou les coups de pouce',
        },
        content: (
          <OnboardingHelpsForm onSubmit={onSubmitFirstSecondStepOnboarding} />
        ),
      },
      {
        text: {
          title: 'Complétez votre profil',
          description:
            "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
        },
        content: (
          <OnboardingJobForm
            onSubmit={onSubmitFirstSecondStepOnboarding}
            onBeforeStep={onBeforeStep}
          />
        ),
      },
      {
        text: {
          title: 'Complétez votre profil',
          description:
            "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
        },
        content: (
          <OnboardingProfileForm
            onSubmit={onSubmitLastStepOnboarding}
            onBeforeStep={onBeforeStep}
          />
        ),
      },
    ];
  }, [
    onSubmitFirstSecondStepOnboarding,
    onSubmitLastStepOnboarding,
    onBeforeStep,
  ]);

  if (!modals?.[onboardingCurrentStep].content) return null; // to avoid undefined

  return (
    <ModalGeneric
      title={modals?.[onboardingCurrentStep].text.title}
      description={modals?.[onboardingCurrentStep].text.description}
      noCloseIcon
    >
      {modals?.[onboardingCurrentStep].content}
    </ModalGeneric>
  );
};
