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

export interface PrettyModalProps {
  id: string;
  title: string;
  subtitle?: string;
  size?: ModalSize;
  submitBtnTxt?: string;
  children?: React.ReactNode;
}

export const PrettyModal = ({
  id,
  title,
  subtitle,
  size = 'medium',
  submitBtnTxt = 'Envoyer',
  children,
}: PrettyModalProps) => {
  const { onClose } = useModalContext();

  return (
    <Modal id={id} size={size}>
      <StyledModalHeaderContainer>
        <StyledModalHeaderIconContainer>
          <LucidIcon name="BadgeCheck" color="white" size={48} />
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
        <Button size="large" onClick={onClose}>
          {submitBtnTxt}
        </Button>
      </StyledModalFooterContainer>
    </Modal>
  );
};
