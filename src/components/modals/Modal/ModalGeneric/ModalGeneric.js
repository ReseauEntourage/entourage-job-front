import React from 'react';
import PropTypes from 'prop-types';
import { Modal, useModalContext } from 'src/components/modals/Modal';
import { CloseButton, Button } from 'src/components/utils';
import { StyledModalContent } from 'src/components/modals/Modal/Modals.styles';
import HeaderModal from './HeaderModal';

const ModalGeneric = ({
  title,
  description,
  children,
  onClose: customOnClose,
  className,
  fullWidth,
  removePadding,
  withCloseButton,
}) => {
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

ModalGeneric.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  onClose: PropTypes.func,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  removePadding: PropTypes.bool,
  withCloseButton: PropTypes.bool,
};

ModalGeneric.defaultProps = {
  description: undefined,
  title: undefined,
  onClose: undefined,
  className: '',
  fullWidth: false,
  removePadding: false,
  withCloseButton: false,
};

export default ModalGeneric;
