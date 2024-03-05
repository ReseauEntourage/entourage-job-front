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
import { IsArrayFilterConstant } from 'src/components/forms/FormSchema';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
import { FilterConstant } from 'src/constants/utils';

let debounceTimeoutId;

interface SelectAsyncProps<T extends FilterConstant | FilterConstant[]>
  extends CommonInputProps<T, HTMLSelectElement> {
  loadOptions: (
    callback: (options: IsArrayFilterConstant<T>) => void,
    inputValue: string
  ) => void;
  isMulti?: boolean;
  openMenuOnClick?: boolean;
}

export function SelectAsync<T extends FilterConstant | FilterConstant[]>({
  id,
  name,
  title,
  value,
  placeholder,
  error,
  onChange,
  onBlur,
  isMulti = false,
  loadOptions,
  disabled = false,
  hidden = false,
  openMenuOnClick = true,
  showLabel = false,
  inputRef,
}: SelectAsyncProps<T>) {
  const [defaultOptions, setDefaultOptions] = useState<
    IsArrayFilterConstant<T>
  >(
    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const debouncedLoadOptions = useCallback(
    (inputValue, callback) => {
      setIsLoading(true);
      clearTimeout(debounceTimeoutId);
      debounceTimeoutId = setTimeout(() => {
        loadOptions((options) => {
          callback(options);
          setIsLoading(false);
        }, inputValue);
      }, 1000);
    },
    [loadOptions]
  );

  const onFocus = useCallback(() => {
    setDefaultOptions(
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      [] as IsArrayFilterConstant<T>
    );
    setIsLoading(true);
    loadOptions((options) => {
      setDefaultOptions(options);
      setIsLoading(false);
    }, '');
  }, [loadOptions]);

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
        <AsyncSelect
          id={id}
          onFocus={onFocus}
          components={{ ClearIndicator, DropdownIndicator, MultiValueRemove }}
          classNamePrefix="Select"
          cacheOptions={false}
          isClearable
          isLoading={isLoading}
          defaultOptions={defaultOptions}
          value={value || null}
          isMulti={isMulti}
          placeholder={
            (showLabel ? placeholder : placeholder || title) ||
            'Selectionnez dans la liste...'
          }
          noOptionsMessage={() => {
            return `Aucun résultat`;
          }}
          loadingMessage={() => {
            return `Chargement...`;
          }}
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
