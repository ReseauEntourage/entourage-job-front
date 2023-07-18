import PropTypes from 'prop-types';
import React from 'react';
import { StyledErrorMessage } from 'src/components/forms/Forms.styles';

export const FormValidatorErrorMessage = ({ validObj, newInput }) => {
  if (validObj !== undefined && validObj.message) {
    return newInput ? (
      <StyledErrorMessage>{validObj.message}</StyledErrorMessage>
    ) : (
      <div className="uk-text-meta uk-text-danger" style={{ height: 15 }}>
        {validObj.message}
      </div>
    );
  }
  return null;
};

FormValidatorErrorMessage.propTypes = {
  validObj: PropTypes.shape({ message: PropTypes.string }),
  newInput: PropTypes.bool,
};

FormValidatorErrorMessage.defaultProps = {
  validObj: undefined,
  newInput: false,
};
