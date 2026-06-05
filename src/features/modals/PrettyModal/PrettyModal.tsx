import React, { useState } from 'react';
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
  onSubmit?: () => void | Promise<void>;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  secondaryAction?: React.ReactNode;
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
  secondaryAction,
}: PrettyModalProps) => {
  const defaultIcon = <LucidIcon name="BadgeCheck" color="white" size={48} />;
  const { onClose } = useModalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = async () => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit();
      }
      if (onClose) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
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
          disabled={isSubmitting}
          dataTestId={`${id}-submit-btn`}
        >
          {submitBtnTxt}
        </Button>
        {secondaryAction}
      </StyledModalFooterContainer>
    </Modal>
  );
};
