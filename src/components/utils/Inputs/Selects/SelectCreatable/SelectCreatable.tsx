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
import { FilterConstant } from 'src/constants/utils';

interface SelectCreatableProps<T extends FilterConstant | FilterConstant[]>
  extends CommonInputProps<T, HTMLSelectElement> {
  options: FilterConstant[];
  isMulti?: boolean;
  openMenuOnClick?: boolean;
  maxChar?: number;
  maxItems?: number;
  setIsMaxItemsReached?: (isMaxItemsReached: boolean) => void;
}

export function SelectCreatable<T extends FilterConstant | FilterConstant[]>({
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
}: SelectCreatableProps<T>) {
  const [remainingItems, setRemainingItems] = useState<number>(maxItems || 0);
  const [shouldDisplayOptions, setShouldDisplayOptions] =
    useState<boolean>(true);
  const selectRef = useRef<SelectInstance<FilterConstant, boolean>>(null);

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
    if (!maxItems) return;
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
        />
      </StyledSelect>
      <StyledAnnotations>
        <div>
          <StyledAnnotationsErrorMessage error={error} />
        </div>
        <StyledLimitContainer>
          {maxChar && (
            <StyledLimit>
              <span>
                Chaque élément ne doit pas dépasser {maxChar} caractères.
              </span>
            </StyledLimit>
          )}
          {maxItems && (
            <StyledLimit warning={remainingItems < 0}>
              {remainingItems >= 0 ? (
                <span>{remainingItems} élément(s) restant(s)</span>
              ) : (
                <span>
                  Limite dépassée de {Math.abs(remainingItems)} élément(s)
                </span>
              )}
            </StyledLimit>
          )}
        </StyledLimitContainer>
      </StyledAnnotations>
    </StyledSelectContainer>
  );
}
