import React from 'react';
import { LucidIcon } from '../utils/Icons/LucidIcon';
import { Button } from 'src/components/utils';
import { COLORS } from 'src/constants/styles';

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
      <div
        className="uk-text-center uk-flex uk-flex-column uk-flex-center uk-flex-middle"
        data-testid="success-modal-content"
      >
        <LucidIcon name="Check" size={100} color={COLORS.primaryBlue} />
        {text}
      </div>
      <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom uk-margin-medium-top">
        <Button
          style="default"
          onClick={closeModal}
          dataTestId="success-close-modal"
        >
          Fermer
        </Button>
      </div>
    </>
  );
};
