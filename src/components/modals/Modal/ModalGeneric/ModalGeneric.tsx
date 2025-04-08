import React from 'react';
import { ModalSize } from '../Modal.types';
import { Modal, useModalContext } from 'src/components/modals/Modal';
import { StyledModalContent } from 'src/components/modals/Modal/Modals.styles';
import { CloseButton, Button } from 'src/components/utils';
import { HeaderModal } from './HeaderModal';

interface ModalGenericProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: (onClose?: () => void) => void;
  className?: string;
  size?: ModalSize;
  removePadding?: boolean;
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
  className,
  size = 'medium',
  withCloseButton = false,
  closeOnNextRender = false,
  noCloseIcon = false,
  removePadding = false,
}: ModalGenericProps) => {
  const { onClose } = useModalContext();

  return (
    <Modal
      id={`${id}-container`}
      className={className}
      size={size}
      closeOnNextRender={closeOnNextRender}
      data-testid={id}
      removePadding={removePadding}
    >
      <div id={id} data-testid={id}>
        {!noCloseIcon && (
          <CloseButton
            dataTestId="generic-close-modal"
            onClick={() => {
              if (customOnClose) {
                customOnClose(onClose);
              } else {
                onClose?.();
              }
            }}
          />
        )}
        <HeaderModal title={title} description={description} />
        {children}
        {withCloseButton && (
          <StyledModalContent>
            <Button
              onClick={() => {
                onClose?.();
              }}
              variant="primary"
              rounded
            >
              Fermer
            </Button>
          </StyledModalContent>
        )}
      </div>
    </Modal>
  );
};
