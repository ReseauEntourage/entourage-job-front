import PropTypes from 'prop-types';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { useIsDesktop } from 'src/hooks/utils';
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
  const firstFieldNotHiddenIndex = fields.findIndex((field) => {
    return !!field;
  });

  const isDesktop = useIsDesktop();

  return (
    <StyledInputsContainer isDesktop={isDesktop}>
      {fields.map((field, index) => {
        if (index < firstFieldNotHiddenIndex) {
          return null;
        }
        return (
          <div key={`${index}-${uuidValue}`} className="field-container">
            {field}
          </div>
        );
      })}
      {Array.from({ length: firstFieldNotHiddenIndex }, (_, key) => (
        <div key={`${key}-empty-${uuidValue}`} className="field-container" />
      ))}
      {fields.length === 1 && <div className="field-container" />}
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
