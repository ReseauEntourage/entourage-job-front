import React from 'react';
import PropTypes from 'prop-types';
import { Modal, useModalContext } from 'src/components/modals/Modal';
import { CloseButton } from 'src/components/utils';
import HeaderModal from 'src/components/modals/HeaderModal';

const ModalGeneric = ({
  title,
  description,
  children,
  onClose: customOnClose,
  className,
  fullWidth,
  removePadding,
}) => {
  const { onClose } = useModalContext();
  return (
    <Modal className={className} fullWidth={fullWidth}>
      <div
        className={`uk-margin-auto-vertical ${
          fullWidth ? 'uk-width-expand' : 'uk-width-2xlarge@m'
        }`}
      >
        <div
          className={`uk-modal-body ${
            removePadding ? 'uk-padding-remove' : 'uk-padding'
          }`}
        >
          <CloseButton
            className="uk-modal-close-default"
            onClick={() => {
              if (customOnClose) {
                customOnClose(onClose);
              } else {
                onClose();
              }
            }}
          />
          {title && <HeaderModal>{title}</HeaderModal>}
          {description ? (
            <div className="uk-margin-small-bottom">{description}</div>
          ) : null}
          {children}
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
};

ModalGeneric.defaultProps = {
  description: undefined,
  title: undefined,
  onClose: undefined,
  className: '',
  fullWidth: false,
  removePadding: false,
};

export default ModalGeneric;
