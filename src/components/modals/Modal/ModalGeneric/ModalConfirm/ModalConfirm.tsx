import React from 'react';

import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Button } from 'src/components/utils';

interface ModalConfirmProps {
  onConfirm: () => void;
  text: React.ReactNode;
  title?: string;
  buttonText: string;
  children?: React.ReactNode;
}

export const ModalConfirm = ({
  onConfirm,
  text,
  title,
  buttonText,
  children,
}: ModalConfirmProps) => {
  const { onClose } = useModalContext();
  return (
    <ModalGeneric description={text} title={title}>
      {children && <div className="uk-margin-medium-bottom">{children}</div>}
      <div className="uk-modal-footer uk-padding-remove-bottom">
        <Button
          style="default"
          onClick={onClose}
          dataTestId="modal-confirm-cancel"
        >
          Annuler
        </Button>
        <Button
          style="primary"
          dataTestId="modal-confirm-confirm"
          onClick={() => {
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            onClose();
            onConfirm();
          }}
        >
          {buttonText}
        </Button>
      </div>
    </ModalGeneric>
  );
};
