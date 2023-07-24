import React from 'react';
import ReactSelect from 'react-select';
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
} from '../Selects';

import { StyledSelect, StyledSelectContainer } from '../Selects.styles';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { FilterConstant } from 'src/constants';

interface SelectProps {
  id: string;
  value: FilterConstant | FilterConstant[];
  placeholder: string;
  isMulti: boolean;
  options: FilterConstant[];
  isDisabled: boolean;
  isHidden: boolean;
  onChange: (event: FilterConstant) => void;
  openMenuOnClick: boolean;
  valid: {
    isInvalid: boolean;
    message: string;
  };
}
export function Select({
  id,
  value,
  placeholder,
  valid,
  options,
  isDisabled = false,
  isMulti = false,
  isHidden = false,
  onChange = () => null,
  openMenuOnClick = false,
}: SelectProps) {
  if (isHidden) {
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
          isDisabled={isDisabled}
          isHidden={isHidden}
          onChange={onChange}
          openMenuOnClick={openMenuOnClick}
        />
      </StyledSelect>
      <FormValidatorErrorMessage validObj={valid} />
    </StyledSelectContainer>
  );
}
