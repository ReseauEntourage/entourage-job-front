import Link from 'next/link';
import React from 'react';
import { useOnboarding } from '../useOnboarding';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { Card, Typography } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { Spinner } from 'src/components/utils/Spinner';
import {
  StyledOnboardingContainer,
  StyledOnboardingFooter,
  StyledOnboardingSpinnerContainer,
} from './Onboarding.styles';

export function Onboarding() {
  const {
    isLoading,
    pageContent,
    pageData,
    isFirstOnboardingStep,
    onSubmitStepForm,
    onBack,
  } = useOnboarding();

  return (
    <StyledOnboardingContainer>
      <Card title="Créer mon compte Entourage Pro en 5 minutes">
        {!isLoading && (
          <>
            <H6 weight="normal" title={pageContent.subtitle} />
            <FormWithValidation
              formSchema={pageContent.form}
              defaultValues={pageData}
              onSubmit={onSubmitStepForm}
              submitText="Suivant"
              cancelText="Précédent"
              {...(!isFirstOnboardingStep ? { onCancel: onBack } : {})}
            />
          </>
        )}
        {isLoading && (
          <StyledOnboardingSpinnerContainer>
            <Spinner />
          </StyledOnboardingSpinnerContainer>
        )}
        <StyledOnboardingFooter>
          <Typography size="small">
            Vous avez déjà un compte ? <Link href="/login">Connectez-vous</Link>
          </Typography>
        </StyledOnboardingFooter>
      </Card>
    </StyledOnboardingContainer>
  );
}
