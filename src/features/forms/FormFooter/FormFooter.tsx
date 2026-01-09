import React, { FormEvent, ReactNode } from 'react';
import { Button } from '@/src/components/ui/Button';
import { ButtonPost } from '@/src/components/ui/Button/ButtonPost';
import {
  StyledCompulsoryMessage,
  StyledErrorMessage,
  StyledFooterForm,
} from './FormFooter.styles';

interface FooterFormProps {
  error?: ReactNode;
  onCancel?: () => void;
  onSubmit: (event?: FormEvent) => Promise<void>;
  submitText?: string;
  submitBtnVariant?: 'primary' | 'secondary';
  cancelText?: string;
  formId: string;
  isLoadingOverride?: boolean;
  noCompulsory?: boolean;
  disabled?: boolean;
}

export const FormFooter = ({
  error,
  onSubmit,
  onCancel,
  submitText,
  cancelText,
  formId,
  isLoadingOverride = false,
  noCompulsory = false,
  submitBtnVariant = 'primary',
  disabled = false,
}: FooterFormProps) => {
  return (
    <StyledFooterForm>
      {typeof error === 'string' && error ? (
        <StyledErrorMessage>{error}</StyledErrorMessage>
      ) : (
        error
      )}
      <div>
        {!noCompulsory && (
          <StyledCompulsoryMessage>
            * : Mentions obligatoires
          </StyledCompulsoryMessage>
        )}

        <div className="cta-container">
          <div>
            {onCancel && (
              <Button
                variant="secondary"
                rounded
                onClick={onCancel}
                disabled={disabled}
                dataTestId={`form-cancel-${formId}`}
              >
                {cancelText || 'Annuler'}
              </Button>
            )}
            <ButtonPost
              text={submitText || 'Envoyer'}
              variant={submitBtnVariant}
              action={onSubmit}
              isLoadingOverride={isLoadingOverride}
              disabled={disabled}
              dataTestId={`form-confirm-${formId}`}
            />
          </div>
        </div>
      </div>
    </StyledFooterForm>
  );
};
