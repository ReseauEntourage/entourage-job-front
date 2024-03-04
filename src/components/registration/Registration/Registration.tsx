import Link from 'next/link';
import React from 'react';
import { useRegistration } from '../useRegistration';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { Card, Typography } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { Spinner } from 'src/components/utils/Spinner';
import {
  StyledRegistrationContainer,
  StyledRegistrationFooter,
  StyledRegistrationSpinnerContainer,
} from './Registration.styles';

export function Registration() {
  const {
    isLoading,
    pageContent,
    pageData,
    isFirstRegistrationStep,
    onSubmitStepForm,
    onBack,
  } = useRegistration();

  return (
    <StyledRegistrationContainer>
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
