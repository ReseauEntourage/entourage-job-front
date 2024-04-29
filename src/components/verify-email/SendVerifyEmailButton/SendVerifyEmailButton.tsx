import React from 'react';
import { useSendVerifyEmail } from '../useSendVerifyEmail';
import { Button } from 'src/components/utils';

export const SendVerifyEmailButton = () => {
  const { isSent, sendVerifyEmail } = useSendVerifyEmail();

  return (
    <>
      {isSent ? (
        <Button disabled style="custom-secondary">
          Email envoyé !
        </Button>
      ) : (
        <Button onClick={() => sendVerifyEmail()} style="custom-secondary">
          Me renvoyer un email de vérification
        </Button>
      )}
    </>
  );
};
