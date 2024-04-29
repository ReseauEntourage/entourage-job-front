import React from 'react';
import { SendVerifyEmailButton } from '../SendVerifyEmailButton';
import { useVerifyEmail } from '../useVerifyEmail';
import { Button, Img } from 'src/components/utils';
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

  if (
    verifyEmailTokenError === VerifyEmailTokenErrorType.TOKEN_EXPIRED ||
    verifyEmailTokenError === VerifyEmailTokenErrorType.TOKEN_INVALID
  ) {
    return (
      <StyledVerifyEmailContainer>
        <H3 title="Vérification de mon adresse e-mail" />
        <StyledVerifyEmailRow>
          <Img
            src="/static/img/illustrations/illu-evenement.png"
            alt="Evenements"
            {...iconSizeProps}
          />
          <div data-test-id="verify-email-message">
            {verifyEmailTokenError ===
            VerifyEmailTokenErrorType.TOKEN_EXPIRED ? (
              <>
                Votre lien de confirmation a expiré. Veuillez demander un
                nouveau
              </>
            ) : (
              <>
                Une erreur est survenue lors de la vérification de votre adresse
                email.
              </>
            )}
          </div>
        </StyledVerifyEmailRow>
        <SendVerifyEmailButton />
      </StyledVerifyEmailContainer>
    );
  }

  return (
    <StyledVerifyEmailContainer>
      <H3 title="Vérification de mon adresse e-mail" />
      <StyledVerifyEmailRow>
        <Img
          src="/static/img/illustrations/illu-evenement.png"
          alt="Evenements"
          {...iconSizeProps}
        />
        <div data-test-id="verify-email-message">
          {verifyEmailTokenError ===
          VerifyEmailTokenErrorType.ALREADY_VERIFIED ? (
            <>Votre adresse à déjà été vérifiée !</>
          ) : (
            <>Votre adresse email à bien été vérifiée </>
          )}
        </div>
      </StyledVerifyEmailRow>
      <Button href="/login" style="custom-secondary">
        Se connecter à mon espace
      </Button>
    </StyledVerifyEmailContainer>
  );
};
