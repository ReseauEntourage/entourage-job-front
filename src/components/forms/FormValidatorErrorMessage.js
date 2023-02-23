import React from 'react';
import PropTypes from 'prop-types';

const FormValidatorErrorMessage = ({ validObj }) => {
  if (validObj !== undefined && validObj.message) {
    return (
      <div className="uk-text-meta uk-text-danger" style={{ height: 15 }}>
        {validObj.message}
      </div>
    );
  }
  return null;
};

FormValidatorErrorMessage.propTypes = {
  validObj: PropTypes.shape({ message: PropTypes.string }),
};

FormValidatorErrorMessage.defaultProps = {
  validObj: undefined,
};

export default FormValidatorErrorMessage;
