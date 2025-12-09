import React from 'react';
import { ModalSize } from '../Modal.types';
import { Modal, useModalContext } from 'src/components/modals/Modal';
import { StyledModalContent } from 'src/components/modals/Modal/Modals.styles';
import { Button } from 'src/components/utils';
import { HeaderModal } from './HeaderModal';

interface ModalGenericProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: (onClose?: () => void) => void;
  size?: ModalSize;
  withCloseButton?: boolean;
  closeOnNextRender?: boolean;
  noCloseIcon?: boolean;
}

const id = 'modal-generic';

export const ModalGeneric = ({
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
    <Modal
      id={`${id}-container`}
      size={size}
      closeOnNextRender={closeOnNextRender}
      data-testid={id}
    >
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
