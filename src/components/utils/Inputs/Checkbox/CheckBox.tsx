import PropTypes from 'prop-types';
import React from 'react';
import { StyledCheckbox } from 'src/components/utils/Inputs/Checkbox/CheckBox.styles';

export function Checkbox({
  handleClick,
  disabled,
  hidden,
  value,
  title,
  name,
  id,
}) {
  if (hidden) {
    return null;
  }

  return (
    <StyledCheckbox
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <label
        className={`checkbox-label ${disabled ? 'disabled' : ''}`}
        htmlFor={id}
      >
        <input
          type="checkbox"
          id={id}
          onChange={handleClick}
          disabled={disabled}
          checked={value}
          name={name}
        />
        <span className="checkmark" />
        {title && <span className="label">{title}</span>}
      </label>
    </StyledCheckbox>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  value: PropTypes.string,
  title: PropTypes.string,
};

Checkbox.defaultProps = {
  disabled: false,
  hidden: false,
  value: false,
  title: '',
};
