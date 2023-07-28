import React, { useCallback, useState } from 'react';
import AsyncSelect from 'react-select/async';
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

let debounceTimeoutId;

interface SelectAsyncProps
  extends CommonInputProps<
    FilterConstant | FilterConstant[],
    HTMLSelectElement
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
  name,
  title,
  value,
  placeholder,
  error,
  onChange,
  onBlur,
  defaultOptions: defaultOptionsProps = true,
  cacheOptions = false,
  isMulti = false,
  noOptionsMessage = () => null,
  loadingMessage = () => null,
  loadOptions,
  disabled = false,
  hidden = false,
  openMenuOnClick = true,
  showLabel = false,
  inputRef,
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
      {showLabel && (
        <StyledInputLabel htmlFor={`form-input-${name}`}>
          {title}
        </StyledInputLabel>
      )}
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
          placeholder={placeholder || title}
          noOptionsMessage={
            noOptionsMessage ||
            (() => {
              return `Aucun résultat`;
            })
          }
          loadingMessage={loadingMessage}
          loadOptions={debouncedLoadOptions}
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
