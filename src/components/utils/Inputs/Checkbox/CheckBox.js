import React from 'react';
import { PropTypes } from 'prop-types';
import { StyledCheckbox } from 'src/components/utils/Inputs/Checkbox/CheckBox.styles';

const Checkbox = ({ handleClick, disabled, value, checked, title }) => {
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
      {title && <span className="label">{title}</span>}
    </StyledCheckbox>
  );
};

Checkbox.propTypes = {
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  title: PropTypes.string,
};

Checkbox.defaultProps = {
  disabled: false,
  value: '',
  title: '',
};

export default Checkbox;
