import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'src/components/utils/Button';
import ButtonPost from 'src/components/backoffice/cv/ButtonPost';
import { StyledFooterForm } from 'src/components/forms/Forms.styles';

const FooterForm = ({
  error,
  onSubmit,
  onCancel,
  submitText,
  cancelText,
  formId,
  noCompulsory,
}) => {
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

FooterForm.propTypes = {
  error: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  formId: PropTypes.string,
  noCompulsory: PropTypes.bool,
};

FooterForm.defaultProps = {
  error: undefined,
  onCancel: undefined,
  submitText: undefined,
  cancelText: undefined,
  formId: '',
  noCompulsory: false,
};

export default FooterForm;
