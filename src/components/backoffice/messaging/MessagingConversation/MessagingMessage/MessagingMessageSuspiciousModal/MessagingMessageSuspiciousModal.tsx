import React from 'react';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Button } from 'src/components/utils';

interface MessagingMessageSuspiciousModalProps {
  href: string;
}

export const MessagingMessageSuspiciousModal = ({
  href,
}: MessagingMessageSuspiciousModalProps) => {
  const { onClose } = useModalContext();

  return (
    <ModalGeneric title="Vous quittez le réseau Entourage Pro">
      Vous êtes sur le point de visiter un site externe non vérifié. Nous ne
      pouvons garantir la sécurité ou la fiabilité de ce lien.
      <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom uk-margin-small-top">
        <Button
          style="default"
          onClick={async () => {
            if (onClose) {
              onClose();
            }
          }}
        >
          Rester sur Entourage Pro
        </Button>
        <Button
          style="primary"
          onClick={async () => {
            if (onClose) {
              onClose();
            }
            window.open(href, '_blank');
          }}
        >
          Accéder au lien
        </Button>
      </div>
    </ModalGeneric>
  );
};
