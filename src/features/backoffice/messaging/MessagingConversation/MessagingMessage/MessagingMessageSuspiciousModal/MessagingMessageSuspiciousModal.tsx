import React from 'react';
import { Button } from '@/src/components/ui';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { StyledModalActions } from '@/src/features/modals/ModalActions.styles';

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
      <StyledModalActions $marginTop={10}>
        <Button
          variant="default"
          onClick={async () => {
            if (onClose) {
              onClose();
            }
          }}
        >
          Rester sur Entourage Pro
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            if (onClose) {
              onClose();
            }
            window.open(href, '_blank');
          }}
        >
          Accéder au lien
        </Button>
      </StyledModalActions>
    </ModalGeneric>
  );
};
