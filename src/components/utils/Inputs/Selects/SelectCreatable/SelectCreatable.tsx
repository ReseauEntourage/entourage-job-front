import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
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
import { IsArrayFilterConstant } from 'src/components/forms/FormSchema';
import { FilterConstant } from 'src/constants/utils';

interface SelectAsyncProps<T extends FilterConstant | FilterConstant[]>
  extends CommonInputProps<T, HTMLSelectElement> {
  options: IsArrayFilterConstant<T>;
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
  inputRef,
  maxChar,
  maxItems,
  setIsMaxItemsReached,
}: SelectAsyncProps<T>) {
  const [remainingItems, setRemainingItems] = useState<number>(
    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    maxItems
  );
  const [shouldDisplayOptions, setShouldDisplayOptions] =
    useState<boolean>(true);

  useEffect(() => {
    const receivedValues = value as FilterConstant[];
    setRemainingItems(
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      receivedValues ? maxItems - receivedValues?.length : maxItems
    );
    if (maxItems && receivedValues) {
      setShouldDisplayOptions(receivedValues.length < maxItems);
    } else {
      setShouldDisplayOptions(true);
    }
  }, [value, maxItems]);

  useEffect(
    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    () => {
      if (!maxItems) return null;
      if (remainingItems < 0) {
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        setIsMaxItemsReached(true);
      } else {
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        setIsMaxItemsReached(false);
      }
    }
  );

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
        <CreatableSelect
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
          ref={inputRef}
          max={maxItems}
          maxLength={maxChar}
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
