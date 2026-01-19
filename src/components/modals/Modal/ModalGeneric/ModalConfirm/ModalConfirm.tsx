import React from 'react';

import { ModalFooter } from '../ModalFooter/ModalFooter';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Button } from 'src/components/utils';

interface ModalConfirmProps {
  onConfirm: () => void;
  text?: React.ReactNode;
  title?: string;
  buttonText: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  keepOpenOnConfirm?: boolean;
}

export const ModalConfirm = ({
  onConfirm,
  text,
  title,
  buttonText,
  children,
  isLoading = false,
  keepOpenOnConfirm = false,
}: ModalConfirmProps) => {
  const { onClose } = useModalContext();
  return (
    <ModalGeneric description={text} title={title}>
      {children && <div className="uk-margin-medium-bottom">{children}</div>}
      <ModalFooter>
        <Button
          variant="default"
          onClick={onClose}
          disabled={isLoading}
          dataTestId="modal-confirm-cancel"
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          dataTestId="modal-confirm-confirm"
          disabled={isLoading}
          onClick={() => {
            if (isLoading) {
              return;
            }
            onConfirm();
            if (onClose && !keepOpenOnConfirm) {
              onClose();
            }
          }}
        >
          {buttonText}
        </Button>
      </ModalFooter>
    </ModalGeneric>
  );
};
