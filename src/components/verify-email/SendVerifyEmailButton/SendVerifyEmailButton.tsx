import React from 'react';
import { useSendVerifyEmail } from '../useSendVerifyEmail';
import { Button } from 'src/components/utils';
import { StyledSendEmailButtonContainer } from './SendVerifyEmailButton.styles';

interface SendVerifyEmailProps {
  email?: string | undefined;
}

export const SendVerifyEmailButton = ({ email }: SendVerifyEmailProps) => {
  const { isSendEmailSuccess, isSendEmailFailed, sendVerifyEmail } =
    useSendVerifyEmail(email);

  const isEmailSent = isSendEmailSuccess || isSendEmailFailed;

  return (
    <StyledSendEmailButtonContainer>
      {isSendEmailSuccess && (
        <Button disabled style="custom-secondary">
          Email envoyé !
        </Button>
      )}
      {isSendEmailFailed && (
        <Button disabled style="custom-secondary">
          Erreur lors de l&apos;envoi de l&apos;email
        </Button>
      )}
      {!isEmailSent && (
        <Button onClick={sendVerifyEmail} style="custom-secondary">
          Me renvoyer un email de vérification
        </Button>
      )}
    </StyledSendEmailButtonContainer>
  );
};
