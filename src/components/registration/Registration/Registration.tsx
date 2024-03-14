import Link from 'next/link';
import React from 'react';
import {
  StyledRegistrationContainer,
  StyledRegistrationFooter,
  StyledRegistrationSpinnerContainer,
  StyledRegistrationSubtitle,
} from '../Registration.styles';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { Card, Typography } from 'src/components/utils';
import { Spinner } from 'src/components/utils/Spinner';
import { useRegistration } from './useRegistration';

export function Registration() {
  const {
    isRegistrationLoading,
    stepContent,
    stepData,
    defaultValues,
    isFirstRegistrationStep,
    onSubmitStepForm,
    onBack,
  } = useRegistration();

  return (
    <StyledRegistrationContainer>
      <Card title="Créer mon compte Entourage Pro en 5 minutes">
        {!isRegistrationLoading && (
          <>
            {stepContent.subtitle && (
              <StyledRegistrationSubtitle>
                <Typography weight="normal">{stepContent.subtitle}</Typography>
                {stepContent.annotation && (
                  <Typography weight="normal" color="lighter" variant="italic">
                    {stepContent.annotation}
                  </Typography>
                )}
              </StyledRegistrationSubtitle>
            )}
            <FormWithValidation
              formSchema={stepContent.form}
              defaultValues={{
                ...(stepData || {}),
                ...(defaultValues || {}),
              }}
              onSubmit={onSubmitStepForm}
              submitText="Suivant"
              cancelText="Précédent"
              {...(!isFirstRegistrationStep ? { onCancel: onBack } : {})}
            />
          </>
        )}
        {isRegistrationLoading && (
          <StyledRegistrationSpinnerContainer>
            <Spinner />
          </StyledRegistrationSpinnerContainer>
        )}
        <StyledRegistrationFooter>
          <Typography size="small">
            Vous avez déjà un compte ? <Link href="/login">Connectez-vous</Link>
          </Typography>
        </StyledRegistrationFooter>
      </Card>
    </StyledRegistrationContainer>
  );
}
