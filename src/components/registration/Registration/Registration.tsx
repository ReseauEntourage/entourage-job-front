import Link from 'next/link';
import React, { useEffect } from 'react';
import { EntourageProLogoPrimary } from 'assets/icons/icons';
import {
  StyledRegistrationContainer,
  StyledRegistrationFooter,
  StyledRegistrationPage,
  StyledRegistrationSpinnerContainer,
  StyledRegistrationSubtitle,
} from '../Registration.styles';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { Card, Typography } from 'src/components/utils';
import { Spinner } from 'src/components/utils/Spinner';
import { isSSR } from 'src/utils/isSSR';
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
    if (!isSSR && !isRegistrationLoading) {
      window.scrollTo(0, 0);
    }
  }, [isRegistrationLoading]);

  return (
    <StyledRegistrationPage>
      <StyledRegistrationContainer>
        <EntourageProLogoPrimary width={226} height={78} />
        <Card title="Créer mon compte Entourage Pro en 5 minutes">
          {!isRegistrationLoading && (
            <>
              {stepContent.subtitle && (
                <StyledRegistrationSubtitle>
                  <Typography weight="normal" size="large">
                    {stepContent.subtitle}
                  </Typography>
                  {stepContent.annotation && (
                    <Typography
                      weight="normal"
                      color="lighter"
                      variant="italic"
                    >
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
                cancelText={isFirstRegistrationStep ? 'Annuler' : 'Précédent'}
                {...{ onCancel: onBack }}
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
              Vous avez déjà un compte ?{' '}
              <Link href="/login">Connectez-vous</Link>
            </Typography>
          </StyledRegistrationFooter>
        </Card>
      </StyledRegistrationContainer>
    </StyledRegistrationPage>
  );
}
