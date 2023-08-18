import React, { FormEvent } from 'react';
import { ButtonPost } from 'src/components/backoffice/cv/ButtonPost';
import { Button } from 'src/components/utils/Button';
import { StyledFooterForm } from './FormFooter.styles';

interface FooterFormProps {
  error?: string;
  onCancel?: () => void;
  onSubmit: (event: FormEvent) => void;
  submitText: string;
  cancelText?: string;
  formId: string;
  noCompulsory?: boolean;
}

// TODO NEW STYLE
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
    <StyledFooterForm className="uk-flex uk-flex-column uk-flex-left">
      {error && (
        <div className="uk-flex uk-flex-1">
          <span className="uk-text-danger uk-margin-small-bottom">{error}</span>
        </div>
      )}
      <div>
        {!noCompulsory && (
          <div className="uk-width-auto@s uk-margin-small-bottom">
            <span className="uk-text-meta">* : Mentions obligatoires</span>
          </div>
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
