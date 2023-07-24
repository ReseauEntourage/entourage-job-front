import React from 'react';
import CreatableSelect from 'react-select/creatable';
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
} from '../Selects';
import { StyledSelect, StyledSelectContainer } from '../Selects.styles';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { FilterConstant } from 'src/constants';

interface SelectAsyncProps {
  id: string;
  value: FilterConstant | FilterConstant[];
  options: FilterConstant[];
  isMulti: boolean;
  placeholder: string;
  isDisabled: boolean;
  isHidden: boolean;
  onChange: (event: FilterConstant) => void;
  openMenuOnClick: boolean;
  valid: {
    isInvalid: boolean;
    message: string;
  };
}
export function SelectCreatable({
  id,
  value,
  placeholder,
  valid,
  options,
  isMulti = false,
  isDisabled = false,
  isHidden = false,
  onChange = () => null,
  openMenuOnClick = false,
}: SelectAsyncProps) {
  if (isHidden) {
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
          isDisabled={isDisabled}
          isHidden={isHidden}
          onChange={onChange}
          openMenuOnClick={openMenuOnClick}
          formatCreateLabel={(userInput) => {
            return `Créer "${userInput}"`;
          }}
        />
      </StyledSelect>
      <FormValidatorErrorMessage validObj={valid} />
    </StyledSelectContainer>
  );
}
