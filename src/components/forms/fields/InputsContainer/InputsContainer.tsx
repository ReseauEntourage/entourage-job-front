import PropTypes from 'prop-types';
import React from 'react';
import uuid from 'uuid/v4';
import { StyledInputsContainer } from './InputsContainer.styles';

interface ContainerTypes {
  title: string;
  fields: React.ReactChild[];
  childWidths: number;
}

const InputsContainer = ({ title, fields, childWidths }: ContainerTypes) => {
  return (
    <StyledInputsContainer>
      {fields.map((field) => {
        return (
          <div key={uuid} className="field-container">
            {field}
          </div>
        );
      })}
    </StyledInputsContainer>
  );
};

InputsContainer.propTypes = {
  title: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.element).isRequired,
  childWidths: PropTypes.arrayOf(PropTypes.string),
};

InputsContainer.defaultProps = {
  title: undefined,
  childWidths: undefined,
};
export default InputsContainer;
