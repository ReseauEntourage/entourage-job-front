import React, { useState } from 'react';
import { Api } from 'src/api';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { Button, Section } from 'src/components/utils';
import { useInternalMessageId } from 'src/hooks/queryParams/useInternalMessageId';

const InternalMessageReSend = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSendStatus] = useState(false);
  const internalMessageId = useInternalMessageId();

  // Send the send request to the API
  const onConfirmButtonClick = async () => {
    try {
      setLoading(true);
      await Api.resendInternalMessageAdmin(internalMessageId);
      setSendStatus(true);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <LayoutBackOffice title="Modération - Envoi d'email déclaré suspicieux">
      <Section className="custom-page">
        <HeaderBackoffice
          title="Gestion des messages internes"
          description="Vous êtes sur le point de renvoyer un message qui a été déclaré comme suspicieux."
        />
        {loading ? (
          <p>Envoi en cours...</p>
        ) : (
          <>
            {sent ? (
              <>
                <p>Le message a bien été renvoyé</p>
              </>
            ) : (
              <>
                <p>
                  Vous êtes sur le point de renvoyer un message qui a été
                  déclaré comme suspicieux. Êtes-vous sûr de vouloir continuer ?
                  Le message a-t-il déjà été renvoyé par un administrateur ?
                </p>
                <Button
                  style="custom-secondary"
                  color="primaryBlue"
                  onClick={onConfirmButtonClick}
                >
                  Renvoyer le message
                </Button>
              </>
            )}
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};

export default InternalMessageReSend;
