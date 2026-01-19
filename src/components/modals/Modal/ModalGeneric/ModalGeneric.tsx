import React from 'react';
import { ModalSize } from '../Modal.types';
import { Modal, useModalContext } from 'src/components/modals/Modal';
import { StyledModalContent } from 'src/components/modals/Modal/Modals.styles';
import { Button } from 'src/components/utils';
import { HeaderModal } from './HeaderModal';

interface ModalGenericProps {
  id?: string;
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: (onClose?: () => void) => void;
  size?: ModalSize;
  withCloseButton?: boolean;
  closeOnNextRender?: boolean;
  noCloseIcon?: boolean;
}

export const ModalGeneric = ({
  id = 'modal-generic',
  title,
  description,
  children,
  onClose: customOnClose,
  size = 'medium',
  withCloseButton = false,
  closeOnNextRender = false,
  noCloseIcon = false,
}: ModalGenericProps) => {
  const { onClose } = useModalContext();
  return (
    <Modal id={id} size={size} closeOnNextRender={closeOnNextRender}>
      <HeaderModal
        title={title}
        description={description}
        noCloseIcon={noCloseIcon}
        onClose={customOnClose}
      />
      <StyledModalContent>
        {children}
        {withCloseButton && (
          <Button
            onClick={() => {
              onClose?.();
            }}
            variant="primary"
            rounded
          >
            Fermer
          </Button>
        )}
      </StyledModalContent>
    </Modal>
  );
};
