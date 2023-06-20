import PropTypes from 'prop-types';
import React from 'react';
import { Button, IconNoSSR } from 'src/components/utils';

export const SuccessModalContent = ({ text, closeModal }) => {
  return (
    <>
      <div
        className="uk-text-center uk-flex uk-flex-column uk-flex-center"
        data-testid="success-modal-content"
      >
        <IconNoSSR name="check" ratio={4} className="uk-text-primary" />
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

SuccessModalContent.propTypes = {
  text: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
