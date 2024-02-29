import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { Container } from 'src/components/utils';
import { onboardingActions } from 'src/use-cases/onboarding';
import { firstOnboardingStep, PageContents } from './Onboarding.types';
import { incrementOnboardingStep } from './Onboarding.utils';
import { useOnboarding } from './useOnboarding';

export function Onboarding() {
  const { push, back } = useRouter();
  const dispatch = useDispatch();

  const { currentStep, pageData } = useOnboarding();

  return (
    <Container>
      {PageContents[currentStep].subtitle}
      <FormWithValidation
        formSchema={PageContents[currentStep].form}
        defaultValues={pageData || {}}
        onSubmit={(fields) => {
          dispatch(onboardingActions.setOnboardingCurrentStepData(fields));
          push(
            `/inscription/${incrementOnboardingStep(currentStep)}`,
            undefined,
            {
              shallow: true,
            }
          );
        }}
        submitText="Suivant"
        cancelText="Précédent"
        {...(currentStep !== firstOnboardingStep ? { onCancel: back } : {})}
      />
      <div>
        Vous avez déjà un compte ? <Link href="/login">Connectez-vous</Link>
      </div>
    </Container>
  );
}
