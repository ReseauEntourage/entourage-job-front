import PropTypes from 'prop-types';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { StyledInputsContainer } from './InputsContainer.styles';

const uuidValue = uuid();

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
      {fields.map((field, key) => {
        return (
          <div key={`${key}-${uuidValue}`} className="field-container">
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
