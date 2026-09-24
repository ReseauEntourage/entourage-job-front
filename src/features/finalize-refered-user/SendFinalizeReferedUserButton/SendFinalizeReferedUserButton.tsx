import React, { useState } from 'react';
import { Api } from '@/src/api';
import { Button } from '@/src/components/ui';

interface SendFinalizeReferedUserButtonProps {
  token: string;
}

type SendStatus = 'idle' | 'sending' | 'sent' | 'failed';

/**
 * Asks for a new activation link, authorized by the (expired) link the
 * candidate opened. Same states as `SendVerifyEmailButton`, which is bound to
 * the generic email verification mutation and so cannot be reused here.
 */
export const SendFinalizeReferedUserButton = ({
  token,
}: SendFinalizeReferedUserButtonProps) => {
  const [status, setStatus] = useState<SendStatus>('idle');

  const sendNewLink = async () => {
    setStatus('sending');
    try {
      await Api.postAuthSendFinalizeReferedUser({ token });
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  };

  if (status === 'sent') {
    return (
      <>
        <p>Un nouveau lien vient de vous être envoyé par email.</p>
        <Button disabled variant="secondary" rounded>
          Email envoyé !
        </Button>
      </>
    );
  }

  if (status === 'failed') {
    return (
      <Button disabled variant="secondary" rounded>
        Erreur lors de l&apos;envoi de l&apos;email
      </Button>
    );
  }

  return (
    <Button
      onClick={sendNewLink}
      disabled={status === 'sending'}
      variant="secondary"
      rounded
    >
      Recevoir un nouveau lien
    </Button>
  );
};
