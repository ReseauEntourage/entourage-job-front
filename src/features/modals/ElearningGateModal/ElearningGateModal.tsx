import React from 'react';
import { Button } from '@/src/components/ui';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';

export const ElearningGateModal = () => {
  const { onClose } = useModalContext();

  return (
    <ModalGeneric
      id="elearning-gate-modal"
      title="Formation requise"
      description="Vous devez compléter votre parcours de formation avant de pouvoir contacter des membres."
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'center',
        }}
      >
        <Button
          href="/backoffice/ressources/formations"
          onClick={() => onClose?.()}
          dataTestId="elearning-gate-formations-link"
        >
          Accéder aux Formations
        </Button>
        <Button
          variant="secondary"
          onClick={() => onClose?.()}
          dataTestId="elearning-gate-close-btn"
        >
          Fermer
        </Button>
      </div>
    </ModalGeneric>
  );
};
