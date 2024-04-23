import React from 'react';
import { useVerifyEmail } from '../useVerifyEmail';
import { Button, Section } from 'src/components/utils';
import { Spinner } from 'src/components/utils/Spinner';
import {
  StyledVerifyEmailErrorDiv,
  StyledVerifyEmailSuccessDiv,
} from './VerifyEmailContainer.styles';

export const VerifyEmailContainer = () => {
  const { isLoading, isError } = useVerifyEmail();
  return (
    <Section>
      {isLoading && <Spinner />}
      {isError && (
        <StyledVerifyEmailErrorDiv>
          Une erreur est survenue lors de la vérification de votre adresse
          email.
        </StyledVerifyEmailErrorDiv>
      )}
      {!isError && (
        <>
          {' '}
          <StyledVerifyEmailSuccessDiv>
            Merci d&apos;avoir vérifié votre adresse email
          </StyledVerifyEmailSuccessDiv>
          <Button href="/login" style="custom-secondary" size="small">
            Connexion
          </Button>
        </>
      )}
    </Section>
  );
};
