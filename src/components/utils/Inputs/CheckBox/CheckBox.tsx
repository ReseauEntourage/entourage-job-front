import PropTypes from 'prop-types';
import React from 'react';
import { StyledCheckbox } from 'src/components/utils/Inputs/CheckBox/CheckBox.styles';

export function CheckBox({
  handleClick,
  disabled,
  hidden,
  value,
  title,
  name,
  id,
  removeMargin,
}) {
  if (hidden) {
    return null;
  }

  return (
    <StyledCheckbox
      removeMargin={removeMargin}
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

CheckBox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  removeMargin: PropTypes.bool,
  hidden: PropTypes.bool,
  value: PropTypes.string,
  title: PropTypes.string,
};

CheckBox.defaultProps = {
  disabled: false,
  hidden: false,
  removeMargin: false,
  value: '',
  title: '',
};
