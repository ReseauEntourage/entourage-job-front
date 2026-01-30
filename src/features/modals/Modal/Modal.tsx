import React, { useCallback, useEffect, useMemo } from 'react';
import ReactModal from 'react-modal';
import { LucidIcon } from '@/src/components/ui';
import { useModalContext } from '@/src/features/modals/Modal/ModalContext';
import { useIsMobile } from '@/src/hooks/utils';
import { BREAKPOINTS, COLORS, HEIGHTS } from 'src/constants/styles';
import { ModalSize } from './Modal.types';
import { StyledCloseButton } from './Modals.styles';

ReactModal.setAppElement('#__next');

interface CustomModalProps {
  id: string;
  children: React.ReactNode;
  closeOnNextRender?: boolean;
  withCloseButton?: boolean;
  size: ModalSize;
}

const CustomModal = ({
  id = 'modal-screen',
  children,
  closeOnNextRender = false,
  withCloseButton = false,
  size,
}: CustomModalProps) => {
  const { onClose } = useModalContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Désactive le scroll du body quand la modal est ouverte
    document.body.style.overflow = 'hidden';
    if (closeOnNextRender && onClose) {
      onClose();
    }
    return () => {
      // Réactive le scroll du body à la fermeture
      document.body.style.overflow = '';
    };
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

  const onRequestClose = useCallback(
    (
      _event: React.MouseEvent | React.KeyboardEvent,
      reason: ReactModal.OnRequestCloseReason
    ) => {
      if (reason === 'backdropClick') {
        return;
      }
      if (onClose) {
        onClose();
      }
    },
    [onClose]
  );

  const headerHeight = useMemo(
    () => (isMobile ? HEIGHTS.HEADER_MOBILE : HEIGHTS.HEADER),
    [isMobile]
  );

  const style = useMemo(() => {
    const mobileStyle = {
      overlay: {},
      content: {
        width: '100%',
        maxWidth: '100%',
        marginTop: headerHeight,
        maxHeight: `calc(100vh - ${headerHeight}px)`,
        padding: '20px 0',
        bottom: 0,
        left: 0,
        right: 0,
        marginRight: 0,
        marginLeft: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    };

    return {
      overlay: {
        zIndex: 1050,
        backgroundColor: 'rgba(0,0,0,.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...(isMobile ? mobileStyle.overlay : {}),
      },
      content: {
        width,
        padding: '10px 0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        backgroundColor: COLORS.white,
        marginLeft: 15,
        marginRight: 15,
        top: 'auto',
        bottom: 'auto',
        left: 'auto',
        right: 'auto',
        borderRadius: 20,
        border: 'none',
        maxHeight: '90vh',
        ...(isMobile ? mobileStyle.content : {}),
      },
    };
  }, [headerHeight, isMobile, width]);

  return (
    <ReactModal
      id={id}
      testId={id}
      closeTimeoutMS={200}
      onAfterOpen={() => {
        // Fix to make modal scroll to top on open
        if (document.getElementsByClassName('ReactModal__Overlay')?.[0]) {
          document
            .getElementsByClassName('ReactModal__Overlay')[0]
            .scrollTo(0, 0);
        }
      }}
      style={style}
      shouldCloseOnOverlayClick={isMobile}
      isOpen
      onRequestClose={onRequestClose}
    >
      {withCloseButton && (
        <StyledCloseButton
          type="button"
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }}
        >
          <LucidIcon name="X" size={24} color={COLORS.darkGray} />
        </StyledCloseButton>
      )}
      {children}
    </ReactModal>
  );
};

export { CustomModal as Modal };
