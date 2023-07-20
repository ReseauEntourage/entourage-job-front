import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useModalContext } from 'src/components/modals/Modal/ModalContext';

Modal.setAppElement('#__next');

const CustomModal = ({ children, closeOnNextRender, className, fullWidth }) => {
  const { onClose } = useModalContext();

  useEffect(() => {
    if (closeOnNextRender && onClose) {
      onClose();
    }
  }, [closeOnNextRender, onClose]);

  return (
    <Modal
      id="modal-screen"
      closeTimeoutMS={200}
      style={{
        overlay: {
          zIndex: 1050,
          backgroundColor: 'rgba(0,0,0,.6)',
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'auto',
        },
        content: {
          top: 'auto',
          bottom: 'auto',
          left: 'auto',
          right: 'auto',
          borderRadius: 0,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          backgroundColor: 'transparent',
          width: fullWidth ? '100%' : 'inherit',
        },
      }}
      shouldCloseOnOverlayClick={false}
      isOpen
      onRequestClose={(event, reason) => {
        if (reason === 'backdropClick') {
          return;
        }
        onClose();
      }}
    >
      <div
        className={`uk-background-default ${className} ${
          fullWidth ? 'uk-width-expand' : ''
        } uk-border-rounded`}
        style={{ margin: 15, position: 'relative' }}
      >
        {children}
      </div>
    </Modal>
  );
};

CustomModal.propTypes = {
  children: PropTypes.element.isRequired,
  closeOnNextRender: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

CustomModal.defaultProps = {
  closeOnNextRender: false,
  className: '',
  fullWidth: false,
};

export { CustomModal as Modal };
