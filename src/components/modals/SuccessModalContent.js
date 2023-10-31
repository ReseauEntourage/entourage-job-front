import PropTypes from 'prop-types';
import React from 'react';
import CheckIcon from 'assets/icons/check.svg';
import { Button } from 'src/components/utils';

export const SuccessModalContent = ({ text, closeModal }) => {
  return (
    <>
      <div
        className="uk-text-center uk-flex uk-flex-column uk-flex-center uk-flex-middle"
        data-testid="success-modal-content"
      >
        <CheckIcon className="uk-text-primary" width={100} height={100} />
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
