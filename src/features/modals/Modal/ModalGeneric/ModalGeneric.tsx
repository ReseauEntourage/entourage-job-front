import React from 'react';
import { Button } from '@/src/components/ui';
import { Modal, useModalContext } from '@/src/features/modals/Modal';
import { StyledModalContent } from '@/src/features/modals/Modal/Modals.styles';
import { ModalSize } from '../Modal.types';
import { HeaderModal } from './HeaderModal';
import { ModalFooter } from './ModalFooter/ModalFooter';

interface ModalGenericProps {
  id?: string;
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: (onClose?: () => void) => void;
  size?: ModalSize;
  withCloseButton?: boolean;
  closeOnNextRender?: boolean;
  noCloseIcon?: boolean;
  buttonText?: string;
  /** Alignement du titre et de la description dans l'en-tête. */
  align?: 'center' | 'left';
  /**
   * Actions posées sous le corps défilant, hors de la zone qui défile — le
   * corps peut alors être plus haut que la modale sans les emporter.
   */
  footer?: React.ReactNode;
  /** Nom de la modale pour les lecteurs d'écran. */
  ariaLabel?: string;
}

export const ModalGeneric = ({
  id = 'modal-generic',
  title,
  description,
  children,
  onClose: customOnClose,
  size = 'medium',
  withCloseButton = false,
  closeOnNextRender = false,
  noCloseIcon = false,
  buttonText = 'Fermer',
  align = 'center',
  footer,
  ariaLabel,
}: ModalGenericProps & { buttonText?: string }) => {
  const { onClose } = useModalContext();
  return (
    <Modal
      id={id}
      size={size}
      closeOnNextRender={closeOnNextRender}
      ariaLabel={ariaLabel}
    >
      <HeaderModal
        title={title}
        description={description}
        noCloseIcon={noCloseIcon}
        onClose={customOnClose}
        align={align}
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
            {buttonText}
          </Button>
        )}
      </StyledModalContent>
      {footer && <ModalFooter layout="spread">{footer}</ModalFooter>}
    </Modal>
  );
};
