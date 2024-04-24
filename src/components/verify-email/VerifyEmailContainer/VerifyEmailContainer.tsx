import React from 'react';
import { useVerifyEmail } from '../useVerifyEmail';
import { Button, Img } from 'src/components/utils';
import { Spinner } from 'src/components/utils/Spinner';
import { StyledVerifyEmailContainer } from './VerifyEmailContainer.styles';

export const VerifyEmailContainer = () => {
  const { isLoading, isError } = useVerifyEmail();

  const iconSizeProps = { width: 60, height: 60 };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {isError ? (
        <StyledVerifyEmailContainer>
          <Img
            src="/static/img/illustrations/illu-evenement.png"
            alt="Evenements"
            {...iconSizeProps}
          />
          <div>
            Une erreur est survenue lors de la vérification de votre adresse
            email.
          </div>
        </StyledVerifyEmailContainer>
      ) : (
        <StyledVerifyEmailContainer>
          <Img
            src="/static/img/illustrations/illu-evenement.png"
            alt="Evenements"
            {...iconSizeProps}
          />
          <div>Votre adresse email à bien été confirmée</div>
          <Button href="/login" style="custom-secondary" size="small">
            Se connecter à mon espace
          </Button>
        </StyledVerifyEmailContainer>
      )}
    </>
  );
};
