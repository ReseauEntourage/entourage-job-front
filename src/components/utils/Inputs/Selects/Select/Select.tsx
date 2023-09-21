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
import { IsArrayFilterConstant } from 'src/components/forms/FormSchema';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
import { FilterConstant } from 'src/constants/utils';

interface SelectProps<T extends FilterConstant | FilterConstant[]>
  extends CommonInputProps<T, HTMLSelectElement> {
  isMulti?: boolean;
  options: IsArrayFilterConstant<T>;
  openMenuOnClick?: boolean;
}
export function Select<T extends FilterConstant | FilterConstant[]>({
  id,
  name,
  title,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  options,
  disabled = false,
  isMulti = false,
  hidden = false,
  openMenuOnClick = true,
  showLabel = false,
  inputRef,
}: SelectProps<T>) {
  if (hidden) {
    return null;
  }

  return (
    <StyledSelectContainer disabled={disabled}>
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
          placeholder={
            showLabel
              ? placeholder || 'Selectionnez dans la liste...'
              : placeholder || title
          }
          isDisabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          openMenuOnClick={openMenuOnClick}
          ref={inputRef}
        />
      </StyledSelect>
      <FieldErrorMessage error={error} />
    </StyledSelectContainer>
  );
}
