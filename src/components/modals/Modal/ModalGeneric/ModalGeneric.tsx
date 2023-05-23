import React from 'react';
import { Modal, useModalContext } from 'src/components/modals/Modal';
import { StyledModalContent } from 'src/components/modals/Modal/Modals.styles';
import { CloseButton, Button } from 'src/components/utils';
import HeaderModal from './HeaderModal';

interface ModalGenericType {
  children: JSX.Element | JSX.Element[];
  title: string | JSX.Element | JSX.Element[];
  description?: string | JSX.Element | JSX.Element[];
  onClose?: (arg1?: () => void) => void;
  className?: string;
  fullWidth?: boolean;
  removePadding?: boolean;
  withCloseButton?: boolean;
}

const ModalGeneric = ({
  title,
  description,
  children,
  onClose: customOnClose,
  className,
  fullWidth,
  removePadding,
  withCloseButton,
}: ModalGenericType) => {
  const { onClose } = useModalContext();

  return (
    <Modal className={className} fullWidth={fullWidth}>
      <div
        className={`uk-margin-auto-vertical ${
          fullWidth ? 'uk-width-expand' : 'uk-width-2xlarge@m'
        }`}
        data-testid="modal-generic"
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
                dataTestId="inscription-candidat-confirm-close"
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
  onClose: () => {
    // do nothing.
  },
  className: '',
  fullWidth: false,
  removePadding: false,
  withCloseButton: false,
  description: '',
};

export default ModalGeneric;
