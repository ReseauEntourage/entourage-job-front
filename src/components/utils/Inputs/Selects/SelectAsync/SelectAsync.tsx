import React, { useCallback, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { CommonInputProps } from '../../Inputs.types';
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
} from '../Selects';
import { StyledSelect, StyledSelectContainer } from '../Selects.styles';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { FilterConstant } from 'src/constants';

let debounceTimeoutId;

interface SelectAsyncProps
  extends CommonInputProps<
    FilterConstant | FilterConstant[],
    HTMLSelectElement,
    FilterConstant | FilterConstant[]
  > {
  loadOptions: (
    inputValue: string,
    callback: (options: FilterConstant[]) => void
  ) => void;
  cacheOptions?: boolean;
  defaultOptions?: FilterConstant | FilterConstant[] | boolean;
  isMulti?: boolean;
  noOptionsMessage?: () => void;
  loadingMessage?: () => void;

  openMenuOnClick?: boolean;
}
export function SelectAsync({
  id,
  value,
  placeholder,
  error,
  onChange,
  defaultOptions: defaultOptionsProps = true,
  cacheOptions = false,
  isMulti = false,
  noOptionsMessage = () => null,
  loadingMessage = () => null,
  loadOptions,
  disabled = false,
  hidden = false,
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

  if (hidden) {
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
