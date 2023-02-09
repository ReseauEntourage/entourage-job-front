import PropTypes from 'prop-types';
import React from 'react';
import uuid from 'uuid/v4';
import { StyledInputsContainer } from './InputsContainer.styles';

interface ContainerTypes {
  fields: React.ReactNode[];
  /*  title: string;
  childWidths: number; */
}

const InputsContainer = ({
  fields /* title, childWidths */,
}: ContainerTypes) => {
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
  fields: PropTypes.arrayOf(PropTypes.element).isRequired,
  /* title: PropTypes.string,
  childWidths: PropTypes.arrayOf(PropTypes.string), */
};

InputsContainer.defaultProps = {
  /* title: undefined,
  childWidths: undefined, */
};
export default InputsContainer;
