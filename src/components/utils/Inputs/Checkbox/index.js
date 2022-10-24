import React from 'react';
import { PropTypes } from 'prop-types';
import { StyledCheckbox } from 'src/components/utils/Inputs/Checkbox/styles';

const Checkbox = ({ handleClick, disabled, value, checked }) => {
  return (
    <StyledCheckbox>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className={`checkbox-label ${disabled ? 'disabled' : ''}`}>
        <input
          type="checkbox"
          onClick={handleClick}
          disabled={disabled}
          value={value}
          checked={checked}
        />
        <span className="checkmark" />
      </label>
    </StyledCheckbox>
  );
};

Checkbox.propTypes = {
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  checked: PropTypes.bool.isRequired,
};

Checkbox.defaultProps = {
  disabled: false,
  value: '',
};

export default Checkbox;
