import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { Card, Typography } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { Spinner } from 'src/components/utils/Spinner';
import { useResetForm } from 'src/hooks/utils';
import { onboardingActions } from 'src/use-cases/onboarding';
import {
  StyledOnboardingContainer,
  StyledOnboardingFooter,
  StyledOnboardingSpinnerContainer,
} from './Onboarding.styles';
import { useOnboarding } from './useOnboarding';

export function Onboarding() {
  const { push, back } = useRouter();
  const dispatch = useDispatch();
  const [form, resetForm] = useResetForm();

  const {
    pageContent,
    pageData,
    isFirstOnboardingStep,
    isLastOnboardingStep,
    nextStep,
  } = useOnboarding();

  return (
    <StyledOnboardingContainer>
      <Card title="Créer mon compte Entourage Pro en 5 minutes">
        {pageContent && (
          <>
            <H6 weight="normal" title={pageContent.subtitle} />
            <FormWithValidation
              innerRef={form}
              formSchema={pageContent.form}
              defaultValues={pageData}
              onSubmit={(fields) => {
                dispatch(
                  onboardingActions.setOnboardingCurrentStepData(fields)
                );
                resetForm();
                if (!isLastOnboardingStep) {
                  push(`/inscription/${nextStep}`, undefined, {
                    shallow: true,
                  });
                }
              }}
              submitText="Suivant"
              cancelText="Précédent"
              {...(!isFirstOnboardingStep ? { onCancel: back } : {})}
            />
          </>
        )}
        {!pageContent && (
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
