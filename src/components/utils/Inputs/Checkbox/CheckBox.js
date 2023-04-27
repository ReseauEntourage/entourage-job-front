import React from 'react';
import PropTypes from 'prop-types';
import { StyledCheckbox } from 'src/components/utils/Inputs/Checkbox/CheckBox.styles';

const Checkbox = ({
  handleClick,
  disabled,
  value,
  checked,
  title,
  name,
  id,
}) => {
  return (
    <StyledCheckbox
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        className={`checkbox-label ${disabled ? 'disabled' : ''}`}
        htmlFor={id}
      >
        <input
          type="checkbox"
          id={id}
          onClick={handleClick}
          disabled={disabled}
          value={value}
          checked={checked}
          name={name}
        />
        <span className="checkmark" />
      </label>
      {title && <span className="label">{title}</span>}
    </StyledCheckbox>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  checked: PropTypes.bool.isRequired,
  title: PropTypes.string,
};

Checkbox.defaultProps = {
  disabled: false,
  value: false,
  title: '',
};

export default Checkbox;
