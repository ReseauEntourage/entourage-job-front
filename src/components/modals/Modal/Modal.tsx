import React, { useEffect, useMemo } from 'react';
import ReactModal from 'react-modal';
import { useModalContext } from 'src/components/modals/Modal/ModalContext';
import { BREAKPOINTS } from 'src/constants/styles';
import { ModalSize } from './Modal.types';
import { StyledModal } from './Modals.styles';

ReactModal.setAppElement('#__next');

interface CustomModalProps {
  id: string;
  children: React.ReactNode;
  closeOnNextRender?: boolean;
  className?: string;
  size: ModalSize;
  removePadding: boolean;
}

const CustomModal = ({
  id = 'modal-screen',
  children,
  closeOnNextRender = false,
  className,
  size,
  removePadding,
}: CustomModalProps) => {
  const { onClose } = useModalContext();

  useEffect(() => {
    if (closeOnNextRender && onClose) {
      onClose();
    }
  }, [closeOnNextRender, onClose]);

  const width = useMemo(() => {
    const sizes = {
      small: '500px',
      medium: '750px',
      large: `${BREAKPOINTS.desktop}px`,
      expand: '100%',
    };
    return sizes[size];
  }, [size]);

  return (
    <ReactModal
      id={id}
      closeTimeoutMS={200}
      onAfterOpen={() => {
        // Fix to make modal scroll to top on open
        if (document.getElementsByClassName('ReactModal__Overlay')?.[0]) {
          document
            .getElementsByClassName('ReactModal__Overlay')[0]
            .scrollTo(0, 0);
        }
      }}
      style={{
        overlay: {
          zIndex: 1050,
          backgroundColor: 'rgba(0,0,0,.6)',
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'auto',
        },
        content: {
          marginTop: 'auto',
          marginBottom: 'auto',
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
        },
      }}
      shouldCloseOnOverlayClick={false}
      isOpen
      onRequestClose={(event, reason) => {
        if (reason === 'backdropClick') {
          return;
        }
        if (onClose) onClose();
      }}
    >
      <StyledModal
        className={className}
        width={width}
        removePadding={removePadding}
      >
        {children}
      </StyledModal>
    </ReactModal>
  );
};

export { CustomModal as Modal };
