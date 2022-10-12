import React from 'react';
import { PropTypes } from 'prop-types';
import { StyledCheckbox } from 'src/components/utils/Inputs/Checkbox/styles';

const Checkbox = ({ size, handleClick }) => {
  return (
    <StyledCheckbox>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="checkbox-label">
        <input type="checkbox" onClick={handleClick} />
        <span className="checkmark" />
      </label>
    </StyledCheckbox>
  );
};

Checkbox.propTypes = {
  size: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default Checkbox;
