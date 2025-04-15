import Link from 'next/link';
import React, { useEffect } from 'react';
import {
  StyledRegistrationContainer,
  StyledRegistrationFooter,
  StyledRegistrationSpinnerContainer,
  StyledRegistrationSubtitle,
} from '../Registration.styles';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { Card, Text } from 'src/components/utils';
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

  useEffect(() => {
    if (!isRegistrationLoading) {
      window.scrollTo(0, 0);
    }
  }, [isRegistrationLoading]);

  return (
    <StyledRegistrationContainer>
      <Card title="Créer mon compte Entourage Pro en 5 minutes">
        {!isRegistrationLoading && (
          <>
            {stepContent.subtitle && (
              <StyledRegistrationSubtitle>
                <Text weight="normal">{stepContent.subtitle}</Text>
                {stepContent.annotation && (
                  <Text weight="normal" color="mediumGray" variant="italic">
                    {stepContent.annotation}
                  </Text>
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
          <Text size="small">
            Vous avez déjà un compte ? <Link href="/login">Connectez-vous</Link>
          </Text>
        </StyledRegistrationFooter>
      </Card>
    </StyledRegistrationContainer>
  );
}
