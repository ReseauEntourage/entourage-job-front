import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MultiValue, SelectInstance, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { StyledInputLabel } from '../../Inputs.styles';
import { CommonInputProps } from '../../Inputs.types';
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
} from '../Selects';
import { StyledSelect, StyledSelectContainer } from '../Selects.styles';
import { FilterConstant } from 'src/constants/utils';
import { FieldErrorMessage } from 'src/features/forms/fields/FieldErrorMessage/FieldErrorMessage';

interface SelectAsyncProps<T extends FilterConstant | FilterConstant[]>
  extends CommonInputProps<T, HTMLSelectElement> {
  loadOptions: (
    callback: (options: FilterConstant[]) => void,
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
}: SelectAsyncProps<T>) {
  const [defaultOptions, setDefaultOptions] = useState<FilterConstant[]>();
  const [isLoading, setIsLoading] = useState(false);
  const selectRef = useRef<SelectInstance<FilterConstant, boolean>>(null);
  const debounceTimeoutId = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const currentRequestId = useRef(0);

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimeoutId.current);
      currentRequestId.current += 1;
      setIsLoading(false);
    };
  }, [loadOptions]);

  const debouncedLoadOptions = useCallback(
    (inputValue, callback) => {
      setIsLoading(true);
      clearTimeout(debounceTimeoutId.current);
      const requestId = ++currentRequestId.current;
      debounceTimeoutId.current = setTimeout(() => {
        loadOptions((options) => {
          if (requestId === currentRequestId.current) {
            callback(options);
            setIsLoading(false);
          }
        }, inputValue);
      }, 500);
    },
    [loadOptions]
  );

  const onFocus = useCallback(() => {
    setDefaultOptions([] as FilterConstant[]);
    setIsLoading(true);
    const requestId = ++currentRequestId.current;
    loadOptions((options) => {
      if (requestId === currentRequestId.current) {
        setDefaultOptions(options);
        setIsLoading(false);
      }
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
            'Sélectionnez dans la liste...'
          }
          noOptionsMessage={() => {
            return `Aucun résultat`;
          }}
          loadingMessage={() => {
            return `Chargement...`;
          }}
          loadOptions={debouncedLoadOptions}
          isDisabled={disabled}
          onChange={(newValue) => {
            if (isMulti) {
              const multiValues = newValue as MultiValue<FilterConstant> | null;
              onChange(multiValues as unknown as T);
            } else {
              const singleValue =
                newValue as SingleValue<FilterConstant> | null;
              onChange(singleValue as unknown as T);
            }
          }}
          onBlur={onBlur}
          openMenuOnClick={openMenuOnClick}
          ref={selectRef}
        />
      </StyledSelect>
      {error && <FieldErrorMessage error={error} />}
    </StyledSelectContainer>
  );
}
