import React, { useCallback, useState } from 'react';
import AsyncSelect from 'react-select/async';
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
} from '../Selects';
import { StyledSelect, StyledSelectContainer } from '../Selects.styles';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { FilterConstant } from 'src/constants';

let debounceTimeoutId;

interface SelectAsyncProps {
  id: string;
  cacheOptions: boolean;
  value: FilterConstant | FilterConstant[];
  defaultOptions: FilterConstant | FilterConstant[] | boolean;
  isMulti: boolean;
  placeholder: string;
  noOptionsMessage: () => void;
  loadingMessage: () => void;
  loadOptions: (
    inputValue: string,
    callback: (options: FilterConstant[]) => void
  ) => void;
  isDisabled: boolean;
  isHidden: boolean;
  onChange: (event: FilterConstant) => void;
  openMenuOnClick: boolean;
  valid: {
    isInvalid: boolean;
    message: string;
  };
}
export function SelectAsync({
  id,
  value,
  placeholder,
  valid,
  defaultOptions: defaultOptionsProps = true,
  cacheOptions = false,
  isMulti = false,
  noOptionsMessage = () => null,
  loadingMessage = () => null,
  loadOptions = () => null,
  isDisabled = false,
  isHidden = false,
  onChange = () => null,
  openMenuOnClick = false,
}: SelectAsyncProps) {
  const [defaultOptions, setDefaultOptions] = useState<
    FilterConstant[] | FilterConstant
  >(typeof defaultOptionsProps !== 'boolean' ? defaultOptionsProps : null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedLoadOptions = useCallback(
    (inputValue, callback) => {
      setIsLoading(true);
      clearTimeout(debounceTimeoutId);
      debounceTimeoutId = setTimeout(() => {
        loadOptions(inputValue, (options) => {
          callback(options);
          setIsLoading(false);
        });
      }, 1000);
    },
    [loadOptions]
  );

  const onFocus = useCallback(() => {
    setDefaultOptions([]);
    setIsLoading(true);
    loadOptions('', (options) => {
      setDefaultOptions(options);
      setIsLoading(false);
    });
  }, [loadOptions]);

  if (isHidden) {
    return null;
  }

  return (
    <StyledSelectContainer>
      <StyledSelect>
        <AsyncSelect
          id={id}
          onFocus={onFocus}
          components={{ ClearIndicator, DropdownIndicator, MultiValueRemove }}
          classNamePrefix="Select"
          cacheOptions={!!cacheOptions}
          isClearable
          isLoading={isLoading}
          defaultOptions={defaultOptions}
          value={value || null}
          isMulti={isMulti}
          placeholder={placeholder || 'Sélectionnez...'}
          noOptionsMessage={
            noOptionsMessage ||
            (() => {
              return `Aucun résultat`;
            })
          }
          loadingMessage={loadingMessage}
          loadOptions={debouncedLoadOptions}
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
