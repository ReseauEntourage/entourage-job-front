import React from 'react';
import { Button, LucidIcon } from '@/src/components/ui';
import { H3 } from '@/src/components/ui/Headings';
import { Text } from '@/src/components/ui/Text/Text';
import { Modal, useModalContext } from '../Modal';
import { ModalSize } from '../Modal/Modal.types';
import {
  StyledModalContentContainer,
  StyledModalFooterContainer,
  StyledModalHeaderContainer,
  StyledModalHeaderIconContainer,
  StyledModalSeparator,
} from './PrettyModal.styles';

interface PrettyModalProps {
  id: string;
  title: string;
  subtitle?: string;
  size?: ModalSize;
  submitBtnTxt?: string;
  onSubmit?: () => void;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const PrettyModal = ({
  id,
  title,
  subtitle,
  size = 'medium',
  submitBtnTxt = 'Envoyer',
  onSubmit,
  children,
  icon,
}: PrettyModalProps) => {
  const defaultIcon = <LucidIcon name="BadgeCheck" color="white" size={48} />;
  const { onClose } = useModalContext();

  const handleClose = () => {
    if (onSubmit) {
      onSubmit();
    }
    if (onClose) {
      onClose();
    }
  };

  const displayIcon = icon || defaultIcon;

  return (
    <Modal id={id} size={size}>
      <StyledModalHeaderContainer>
        <StyledModalHeaderIconContainer>
          {displayIcon}
        </StyledModalHeaderIconContainer>
        <H3 weight="bold" title={title} />
        {subtitle && <Text color="darkGray">{subtitle}</Text>}
      </StyledModalHeaderContainer>
      {children && (
        <>
          <StyledModalSeparator />
          <StyledModalContentContainer>{children}</StyledModalContentContainer>
        </>
      )}
      <StyledModalFooterContainer>
        <Button
          size="large"
          onClick={handleClose}
          dataTestId={`${id}-submit-btn`}
        >
          {submitBtnTxt}
        </Button>
      </StyledModalFooterContainer>
    </Modal>
  );
};
