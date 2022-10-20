import React from 'react';
import { PropTypes } from 'prop-types';
import { StyledCheckbox } from 'src/components/utils/Inputs/Checkbox/styles';

const Checkbox = ({ handleClick, disabled }) => {
  return (
    <StyledCheckbox>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className={`checkbox-label ${disabled ? 'disabled' : ''}`}>
        <input type="checkbox" onClick={handleClick} disabled={disabled} />
        <span className="checkmark" />
      </label>
    </StyledCheckbox>
  );
};

Checkbox.propTypes = {
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Checkbox.defaultProps = {
  disabled: false,
};

export default Checkbox;
