import React from 'react';
import { FieldError } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { CommonInputProps } from '../../Inputs.types';
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
} from '../Selects';
import { StyledSelect, StyledSelectContainer } from '../Selects.styles';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { FilterConstant } from 'src/constants';

interface SelectAsyncProps
  extends CommonInputProps<
    FilterConstant | FilterConstant[],
    HTMLSelectElement,
    FilterConstant | FilterConstant[]
  > {
  options: FilterConstant[];
  isMulti?: boolean;
  openMenuOnClick?: boolean;
}
export function SelectCreatable({
  id,
  value,
  placeholder,
  error,
  options,
  isMulti = false,
  disabled = false,
  hidden = false,
  onChange,
  openMenuOnClick = false,
}: SelectAsyncProps) {
  if (hidden) {
    return null;
  }

  return (
    <StyledSelectContainer>
      <StyledSelect>
        <CreatableSelect
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
          formatCreateLabel={(userInput) => {
            return `Créer "${userInput}"`;
          }}
        />
      </StyledSelect>
      <FormValidatorErrorMessage error={error} />
    </StyledSelectContainer>
  );
}
