import React from 'react';
import ReactSelect from 'react-select';
import { CommonInputProps } from '../../Inputs.types';
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
} from '../Selects';

import { StyledSelect, StyledSelectContainer } from '../Selects.styles';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { FilterConstant } from 'src/constants';

interface SelectProps
  extends CommonInputProps<
    FilterConstant | FilterConstant[],
    HTMLSelectElement,
    FilterConstant | FilterConstant[]
  > {
  isMulti?: boolean;
  options: FilterConstant[];
  openMenuOnClick?: boolean;
}
export function Select({
  id,
  value,
  onChange,
  placeholder,
  error,
  options,
  disabled = false,
  isMulti = false,
  hidden = false,
  openMenuOnClick = false,
}: SelectProps) {
  if (hidden) {
    return null;
  }

  return (
    <StyledSelectContainer>
      <StyledSelect>
        <ReactSelect
          id={id}
          components={{ ClearIndicator, DropdownIndicator, MultiValueRemove }}
          classNamePrefix="Select"
          options={options}
          isClearable
          value={value || null}
          isMulti={isMulti}
          placeholder={placeholder || 'Sélectionnez...'}
          isDisabled={disabled}
          isHidden={hidden}
          onChange={onChange}
          openMenuOnClick={openMenuOnClick}
        />
      </StyledSelect>
      <FormValidatorErrorMessage error={error} />
    </StyledSelectContainer>
  );
}
