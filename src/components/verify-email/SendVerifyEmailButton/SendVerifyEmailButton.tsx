import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/src/components/ui';
import { useSendVerifyEmail } from '../useSendVerifyEmail';
import { ReduxRequestEvents } from 'src/constants';
import { sendVerifyEmailSelectors } from 'src/use-cases/authentication';
import { StyledSendEmailButtonContainer } from './SendVerifyEmailButton.styles';

interface SendVerifyEmailProps {
  email?: string | undefined;
}

export const SendVerifyEmailButton = ({ email }: SendVerifyEmailProps) => {
  const { sendVerifyEmail } = useSendVerifyEmail(email);

  const sendVerifyEmailStatus = useSelector(
    sendVerifyEmailSelectors.selectSendVerifyEmailStatus
  );

  const isSendEmailSuccess =
    sendVerifyEmailStatus === ReduxRequestEvents.SUCCEEDED;

  const isSendEmailFailed = sendVerifyEmailStatus === ReduxRequestEvents.FAILED;

  const isEmailSent = isSendEmailSuccess || isSendEmailFailed;

  return (
    <StyledSendEmailButtonContainer>
      {isSendEmailSuccess && (
        <Button disabled variant="secondary" rounded>
          Email envoyé !
        </Button>
      )}
      {isSendEmailFailed && (
        <Button disabled variant="secondary" rounded>
          Erreur lors de l&apos;envoi de l&apos;email
        </Button>
      )}
      {!isEmailSent && (
        <Button onClick={sendVerifyEmail} variant="secondary" rounded>
          Me renvoyer un email de vérification
        </Button>
      )}
    </StyledSendEmailButtonContainer>
  );
};
