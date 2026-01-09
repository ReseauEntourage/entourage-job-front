import Link from 'next/link';
import React, { useEffect } from 'react';
import { Card, Text } from '@/src/components/ui';
import { Spinner } from '@/src/components/ui/Spinner';
import {
  StyledRegistrationContainer,
  StyledRegistrationFooter,
  StyledRegistrationSpinnerContainer,
  StyledRegistrationSubtitle,
} from '../Registration.styles';
import { FormWithValidation } from 'src/features/forms/FormWithValidation';
import { useRegistration } from './useRegistration';

export function Registration() {
  const {
    isRegistrationLoading,
    stepContent,
    selectedFlow,
    data,
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
                ...(data || {}),
              }}
              onSubmit={onSubmitStepForm}
              submitText="Suivant"
              cancelText="Précédent"
              {...(selectedFlow ? { onCancel: onBack } : {})}
            />
          </>
        )}
        {isRegistrationLoading && (
          <StyledRegistrationSpinnerContainer>
            <Spinner />
          </StyledRegistrationSpinnerContainer>
        )}
        <StyledRegistrationFooter>
          <Text color="darkGray" size="small">
            Vous avez déjà un compte ? <Link href="/login">Connectez-vous</Link>
          </Text>
        </StyledRegistrationFooter>
      </Card>
    </StyledRegistrationContainer>
  );
}
