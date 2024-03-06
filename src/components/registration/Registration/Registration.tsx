import Link from 'next/link';
import React from 'react';
import { useRegistration } from '../useRegistration';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { Card, Typography } from 'src/components/utils';
import { Spinner } from 'src/components/utils/Spinner';
import {
  StyledRegistrationContainer,
  StyledRegistrationFooter,
  StyledRegistrationSpinnerContainer,
  StyledRegistrationSubtitle,
} from './Registration.styles';

export function Registration() {
  const {
    isRegistrationLoading,
    pageContent,
    pageData,
    defaultValueFromOtherStep,
    isFirstRegistrationStep,
    onSubmitStepForm,
    onBack,
  } = useRegistration();

  const isLoading = isRegistrationLoading || !pageContent;

  return (
    <StyledRegistrationContainer>
      <Card title="Créer mon compte Entourage Pro en 5 minutes">
        {!isLoading && (
          <>
            {pageContent.subtitle && (
              <StyledRegistrationSubtitle>
                <Typography weight="normal">{pageContent.subtitle}</Typography>
                {pageContent.annotation && (
                  <Typography weight="normal" color="lighter" variant="italic">
                    {pageContent.annotation}
                  </Typography>
                )}
              </StyledRegistrationSubtitle>
            )}
            <FormWithValidation
              formSchema={pageContent.form}
              defaultValues={{
                ...(pageData || {}),
                ...(defaultValueFromOtherStep || {}),
              }}
              onSubmit={onSubmitStepForm}
              submitText="Suivant"
              cancelText="Précédent"
              {...(!isFirstRegistrationStep ? { onCancel: onBack } : {})}
            />
          </>
        )}
        {isLoading && (
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
