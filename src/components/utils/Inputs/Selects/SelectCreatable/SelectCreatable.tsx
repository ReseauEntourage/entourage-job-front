import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { StyledInputLabel } from '../../Inputs.styles';
import { CommonInputProps } from '../../Inputs.types';
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
} from '../Selects';
import { StyledSelect, StyledSelectContainer } from '../Selects.styles';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
import { FilterConstant } from 'src/constants';

interface SelectAsyncProps
  extends CommonInputProps<
    FilterConstant | FilterConstant[],
    HTMLSelectElement
  > {
  options: FilterConstant[];
  isMulti?: boolean;
  openMenuOnClick?: boolean;
}
export function SelectCreatable({
  id,
  name,
  title,
  value,
  placeholder,
  error,
  options,
  isMulti = false,
  disabled = false,
  hidden = false,
  onChange,
  onBlur,
  openMenuOnClick = true,
  showLabel = false,
  inputRef,
}: SelectAsyncProps) {
  if (hidden) {
    return null;
  }

  return (
    <StyledSelectContainer>
      {showLabel && (
        <StyledInputLabel htmlFor={`form-input-${name}`}>
          {title}
        </StyledInputLabel>
      )}
      <StyledSelect>
        <CreatableSelect
          id={id}
          components={{ ClearIndicator, DropdownIndicator, MultiValueRemove }}
          classNamePrefix="Select"
          options={options}
          isClearable
          value={value || null}
          isMulti={isMulti}
          placeholder={placeholder || title}
          isDisabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          openMenuOnClick={openMenuOnClick}
          formatCreateLabel={(userInput) => {
            return `Créer "${userInput}"`;
          }}
          ref={inputRef}
        />
      </StyledSelect>
      <FieldErrorMessage error={error} />
    </StyledSelectContainer>
  );
}
