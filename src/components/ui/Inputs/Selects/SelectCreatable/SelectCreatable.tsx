import React, { useEffect, useRef, useState } from 'react';
import { SelectInstance } from 'react-select';
import AsyncCreatableSelect from 'react-select/async-creatable';

import {
  StyledAnnotations,
  StyledAnnotationsErrorMessage,
  StyledInputLabel,
  StyledLimit,
  StyledLimitContainer,
} from '../../Inputs.styles';
import { CommonInputProps } from '../../Inputs.types';
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
} from '../Selects';
import { StyledSelect, StyledSelectContainer } from '../Selects.styles';
import { Text } from 'src/components/ui';
import { FilterConstant } from 'src/constants/utils';

interface SelectCreatableProps<
  T extends FilterConstant | FilterConstant[] | null
> extends CommonInputProps<T, HTMLSelectElement> {
  options: FilterConstant[];
  isMulti?: boolean;
  openMenuOnClick?: boolean;
  maxChar?: number;
  maxItems?: number;
  setIsMaxItemsReached?: (isMaxItemsReached: boolean) => void;
  loadOptions?: (
    callback: (options: FilterConstant[]) => void,
    inputValue: string
  ) => void;
}

export function SelectCreatable<
  T extends FilterConstant | FilterConstant[] | null
>({
  id,
  name,
  title,
  value,
  placeholder,
  error,
  options,
  isMulti = false,
  disabled = false,
  hidden = false,
  onChange,
  onBlur,
  openMenuOnClick = false,
  showLabel = false,
  maxChar,
  maxItems,
  setIsMaxItemsReached,
  loadOptions,
}: SelectCreatableProps<T>) {
  const [remainingItems, setRemainingItems] = useState<number>(maxItems || 0);
  const [shouldDisplayOptions, setShouldDisplayOptions] =
    useState<boolean>(true);
  const [defaultOptions, setDefaultOptions] = useState<FilterConstant[]>(
    options || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const selectRef = useRef<SelectInstance<FilterConstant, boolean>>(null);

  useEffect(() => {
    // Charger les options par défaut si loadOptions est fourni
    if (loadOptions) {
      setIsLoading(true);
      loadOptions((fetchedOptions) => {
        setDefaultOptions(fetchedOptions);
        setIsLoading(false);
      }, '');
    }
  }, [loadOptions]);

  useEffect(() => {
    const receivedValues = value as FilterConstant[];
    if (maxItems) {
      setRemainingItems(
        receivedValues ? maxItems - receivedValues?.length : maxItems
      );
    }

    if (maxItems && receivedValues) {
      setShouldDisplayOptions(receivedValues.length < maxItems);
    } else {
      setShouldDisplayOptions(true);
    }
  }, [value, maxItems]);

  useEffect(() => {
    if (!maxItems) {
      return;
    }
    if (setIsMaxItemsReached) {
      if (remainingItems < 0) {
        setIsMaxItemsReached(true);
      } else {
        setIsMaxItemsReached(false);
      }
    }
  });

  if (hidden) {
    return null;
  }

  const handleChange = (selectedOptions) => {
    const existingValues = value as FilterConstant[];
    if (
      !maxItems ||
      !selectedOptions ||
      existingValues?.length > selectedOptions?.length ||
      maxItems - selectedOptions?.length >= 0
    ) {
      onChange(selectedOptions);
    }
  };

  return (
    <StyledSelectContainer disabled={disabled}>
      {showLabel && (
        <StyledInputLabel htmlFor={`form-input-${name}`}>
          {title}
        </StyledInputLabel>
      )}
      <StyledSelect>
        <AsyncCreatableSelect
          id={id}
          components={{ ClearIndicator, DropdownIndicator, MultiValueRemove }}
          classNamePrefix="Select"
          options={options}
          isClearable
          value={value || null}
          isMulti={isMulti}
          noOptionsMessage={() => {
            return `Aucun résultat`;
          }}
          placeholder={
            (showLabel ? placeholder : placeholder || title) ||
            'Selectionnez dans la liste...'
          }
          isDisabled={disabled}
          onChange={(selectedOptions) => handleChange(selectedOptions)}
          onBlur={onBlur}
          openMenuOnClick={openMenuOnClick}
          formatCreateLabel={(userInput) => {
            return shouldDisplayOptions
              ? `Créer "${userInput}"`
              : 'Vous avez atteint le maximum';
          }}
          ref={selectRef}
          isValidNewOption={(inputValue) => {
            const isEmpty = inputValue.trim().length === 0;
            return maxChar ? inputValue.length < maxChar && !isEmpty : !isEmpty;
          }}
          loadOptions={(inputValue, callback) => {
            if (loadOptions) {
              loadOptions((fetchedOptions) => {
                callback(fetchedOptions);
              }, inputValue);
            } else if (options) {
              callback(options);
            } else {
              callback([]);
            }
          }}
          defaultOptions={defaultOptions}
          isLoading={isLoading}
        />
      </StyledSelect>
      {(error || maxChar || maxItems) && (
        <StyledAnnotations>
          <div>
            <StyledAnnotationsErrorMessage error={error} />
          </div>
          <StyledLimitContainer>
            {maxChar && (
              <StyledLimit>
                <Text size="small" color="darkGray">
                  Chaque élément ne doit pas dépasser {maxChar} caractères.
                </Text>
              </StyledLimit>
            )}
            {maxItems && (
              <StyledLimit>
                {remainingItems >= 0 ? (
                  <Text size="small" color="darkGray">
                    {remainingItems} élément{remainingItems > 1 ? 's' : ''}{' '}
                    restant{remainingItems > 1 ? 's' : ''}
                  </Text>
                ) : (
                  <Text size="small" color="lightRed">
                    Limite dépassée de {Math.abs(remainingItems)} élément(s)
                  </Text>
                )}
              </StyledLimit>
            )}
          </StyledLimitContainer>
        </StyledAnnotations>
      )}
    </StyledSelectContainer>
  );
}
