import React from 'react';
import { Button } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';
import { LucidIcon } from '../../components/ui/Icons/LucidIcon';
import { StyledModalActions } from './ModalActions.styles';
import { StyledSuccessModalMessage } from './SuccessModalContent.styles';

interface SuccessModalContentProps {
  text: React.ReactNode;
  closeModal: () => void;
}

export const SuccessModalContent = ({
  text,
  closeModal,
}: SuccessModalContentProps) => {
  return (
    <>
      <StyledSuccessModalMessage data-testid="success-modal-content">
        <LucidIcon name="Check" size={100} color={COLORS.primaryBlue} />
        {text}
      </StyledSuccessModalMessage>
      <StyledModalActions $marginTop={40}>
        <Button
          variant="default"
          onClick={closeModal}
          dataTestId="success-close-modal"
        >
          Fermer
        </Button>
      </StyledModalActions>
    </>
  );
};
