import React, { FormEvent } from 'react';
import { Button } from 'src/components/utils/Button';
import { ButtonPost } from 'src/components/utils/Button/ButtonPost';
import {
  StyledCompulsoryMessage,
  StyledErrorMessage,
  StyledFooterForm,
} from './FormFooter.styles';

interface FooterFormProps {
  error?: string;
  onCancel?: () => void;
  onSubmit: (event: FormEvent) => Promise<void>;
  submitText: string;
  cancelText?: string;
  formId: string;
  noCompulsory?: boolean;
}

export const FormFooter = ({
  error,
  onSubmit,
  onCancel,
  submitText,
  cancelText,
  formId,
  noCompulsory = false,
}: FooterFormProps) => {
  return (
    <StyledFooterForm>
      {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
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
                style="custom-primary-inverted"
                color="primaryOrange"
                onClick={onCancel}
                dataTestId={`form-cancel-${formId}`}
              >
                {cancelText || 'Annuler'}
              </Button>
            )}
            <ButtonPost
              text={submitText || 'Envoyer'}
              style="custom-primary"
              action={onSubmit}
              dataTestId={`form-confirm-${formId}`}
            />
          </div>
        </div>
      </div>
    </StyledFooterForm>
  );
};
