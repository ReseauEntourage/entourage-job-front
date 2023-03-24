import React from 'react';
import PropTypes from 'prop-types';
import { StyledErrorMessage } from 'src/components/forms/Forms.styles';

const FormValidatorErrorMessage = ({ validObj, newInput }) => {
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

export default FormValidatorErrorMessage;
