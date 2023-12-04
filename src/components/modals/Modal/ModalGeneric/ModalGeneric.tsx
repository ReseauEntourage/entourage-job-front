import React from 'react';
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
  fullWidth?: boolean;
  removePadding?: boolean;
  withCloseButton?: boolean;
}

const id = 'modal-generic';

export const ModalGeneric = ({
  title,
  description,
  children,
  onClose: customOnClose,
  className,
  fullWidth,
  removePadding,
  withCloseButton,
}: ModalGenericProps) => {
  const { onClose } = useModalContext();

  return (
    <Modal className={className} fullWidth={fullWidth}>
      <div
        id={id}
        className={`uk-margin-auto-vertical ${
          fullWidth ? 'uk-width-expand' : 'uk-width-2xlarge@m'
        }`}
        data-testid={id}
      >
        <div
          className={`uk-modal-body ${
            removePadding ? 'uk-padding-remove' : 'uk-padding'
          }`}
        >
          <CloseButton
            className="uk-modal-close-default"
            dataTestId="generic-close-modal"
            onClick={() => {
              if (customOnClose) {
                customOnClose(onClose);
              } else {
                onClose();
              }
            }}
          />
          <HeaderModal title={title} description={description} />
          {children}
          {withCloseButton && (
            <StyledModalContent>
              <Button
                onClick={() => {
                  onClose();
                }}
                style="custom-primary"
              >
                Fermer
              </Button>
            </StyledModalContent>
          )}
        </div>
      </div>
    </Modal>
  );
};

ModalGeneric.defaultProps = {
  onClose: null,
  className: '',
  fullWidth: false,
  removePadding: false,
  withCloseButton: false,
  description: '',
};
