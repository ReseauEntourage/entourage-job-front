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
}) => {
  const { onClose } = useModalContext();
  return (
    <Modal className={className}>
      <div
        className={`uk-margin-auto-vertical ${
          !fullWidth ? 'uk-width-2xlarge@m' : ''
        }`}
      >
        <div className="uk-modal-body uk-padding">
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
          {description ? <p className="uk-text-lead">{description}</p> : null}
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
};

ModalGeneric.defaultProps = {
  description: undefined,
  title: undefined,
  onClose: undefined,
  className: '',
  fullWidth: false,
};

export default ModalGeneric;
