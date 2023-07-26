import React from 'react';
import ReactSelect from 'react-select';
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

interface SelectProps
  extends CommonInputProps<
    FilterConstant | FilterConstant[],
    HTMLSelectElement
  > {
  isMulti?: boolean;
  options: FilterConstant[];
  openMenuOnClick?: boolean;
}
export function Select({
  id,
  name,
  title,
  value,
  onChange,
  placeholder,
  error,
  options,
  disabled = false,
  isMulti = false,
  hidden = false,
  openMenuOnClick = true,
  showLabel = false,
  inputRef,
}: SelectProps) {
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
        <ReactSelect
          id={id}
          components={{ ClearIndicator, DropdownIndicator, MultiValueRemove }}
          classNamePrefix="Select"
          options={options}
          isClearable
          value={value || null}
          isMulti={isMulti}
          placeholder={placeholder || title}
          isDisabled={disabled}
          isHidden={hidden}
          onChange={onChange}
          openMenuOnClick={openMenuOnClick}
          ref={inputRef}
        />
      </StyledSelect>
      <FieldErrorMessage error={error} />
    </StyledSelectContainer>
  );
}
