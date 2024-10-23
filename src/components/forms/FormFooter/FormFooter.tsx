import React, { FormEvent, ReactNode } from 'react';
import { Button } from 'src/components/utils/Button';
import { ButtonPost } from 'src/components/utils/Button/ButtonPost';
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
  cancelText?: string;
  formId: string;
  isLoadingOverride?: boolean;
  noCompulsory?: boolean;
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
          {onCancel && (
            <Button
              style="custom-secondary"
              color="primaryBlue"
              onClick={onCancel}
              dataTestId={`form-cancel-${formId}`}
            >
              {cancelText || 'Annuler'}
            </Button>
          )}
          <ButtonPost
            text={submitText || 'Envoyer'}
            style="custom-secondary-inverted"
            action={onSubmit}
            isLoadingOverride={isLoadingOverride}
            dataTestId={`form-confirm-${formId}`}
          />
        </div>
      </div>
    </StyledFooterForm>
  );
};
