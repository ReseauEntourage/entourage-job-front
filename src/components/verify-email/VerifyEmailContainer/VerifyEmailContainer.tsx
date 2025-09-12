import React from 'react';
import { SendVerifyEmailButton } from '../SendVerifyEmailButton';
import { useVerifyEmail } from '../useVerifyEmail';
import { Button, LegacyImg } from 'src/components/utils';
import { H3 } from 'src/components/utils/Headings';
import { Spinner } from 'src/components/utils/Spinner';
import { VerifyEmailTokenErrorType } from 'src/use-cases/authentication/authentication.adapters';
import {
  StyledVerifyEmailContainer,
  StyledVerifyEmailRow,
} from './VerifyEmailContainer.styles';

export const VerifyEmailContainer = () => {
  const { isLoading, verifyEmailTokenError } = useVerifyEmail();
  const iconSizeProps = { width: 60, height: 60 };

  if (isLoading) {
    return <Spinner />;
  }

  const showSendButtonAndErrorImg =
    verifyEmailTokenError === VerifyEmailTokenErrorType.TOKEN_EXPIRED ||
    verifyEmailTokenError === VerifyEmailTokenErrorType.TOKEN_INVALID;

  const errorMessages = {
    [VerifyEmailTokenErrorType.TOKEN_EXPIRED]:
      'Votre lien de confirmation a expiré. Veuillez demander un nouveau',
    [VerifyEmailTokenErrorType.TOKEN_INVALID]:
      'Une erreur est survenue lors de la vérification de votre adresse email',
    [VerifyEmailTokenErrorType.ALREADY_VERIFIED]:
      'Votre adresse a déjà été vérifiée !',
  };

  return (
    <StyledVerifyEmailContainer>
      <H3 title="Vérification de mon adresse e-mail" />
      <StyledVerifyEmailRow>
        <LegacyImg
          src={
            showSendButtonAndErrorImg
              ? '/static/img/illustrations/attention.png'
              : '/static/img/illustrations/illu-evenement.png'
          }
          alt="illustration"
          {...iconSizeProps}
        />
        <div data-test-id="verify-email-message">
          {verifyEmailTokenError
            ? errorMessages[verifyEmailTokenError]
            : 'Votre adresse email a bien été vérifiée'}
        </div>
      </StyledVerifyEmailRow>
      {showSendButtonAndErrorImg ? (
        <SendVerifyEmailButton />
      ) : (
        <Button href="/login" variant="secondary">
          Se connecter à mon compte
        </Button>
      )}
    </StyledVerifyEmailContainer>
  );
};
