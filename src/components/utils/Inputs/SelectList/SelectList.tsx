import React, { useCallback } from 'react';
import CheckIcon from 'assets/icons/check.svg';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage';
import { H6 } from 'src/components/utils/Headings';
import { StyledInputLabel } from 'src/components/utils/Inputs/Inputs.styles';
import {
  StyledCheckIconContainer,
  StyledSelectList,
  StyledSelectListContainer,
  StyledSelectOption,
} from './SelectList.styles';
import { SelectListType } from './SelectList.types';

interface SelectListProps<T extends string[]>
  extends CommonInputProps<T, HTMLElement> {
  id: string;
  isMulti?: boolean;
  options: SelectListType[];
}

export function SelectList<T extends string[]>({
  id,
  value: valueProp,
  title,
  onChange,
  onBlur,
  options,
  isMulti = true,
  error,
  name,
  disabled = false,
  hidden = false,
  showLabel = false,
  inputRef,
}: SelectListProps<T>) {
  const handleSelect = useCallback(
    (value: string) => {
      const currentValue = valueProp || [];
      if (currentValue.includes(value)) {
        onChange(currentValue.filter((option) => option !== value) as T);
      } else if (isMulti) {
        onChange([...currentValue, value] as T);
      } else {
        onChange([value] as T);
      }
    },
    [valueProp, isMulti, onChange]
  );

  if (hidden) {
    return null;
  }

  return (
    <StyledSelectListContainer disabled={disabled}>
      {showLabel && (
        <StyledInputLabel htmlFor={`form-input-${name}`}>
          {title}
        </StyledInputLabel>
      )}
      <StyledSelectList data-testid={id}>
        {options.map(({ value, label, description, icon }) => {
          return (
            <li
              id={`${id}-${value}`}
              key={`${id}-${value}`}
              data-testid={`${id}-${value}`}
              className={valueProp?.includes(value) ? 'selected' : ''}
            >
              <button
                onClick={() => handleSelect(value)}
                type="button"
                onBlur={onBlur}
                ref={inputRef}
              >
                <StyledSelectOption>
                  <div className="img-container">{icon}</div>
                  <div className="text-container">
                    <H6 title={label} color="primaryOrange" />
                    <p>{description}</p>
                  </div>
                </StyledSelectOption>
              </button>
              <StyledCheckIconContainer
                className={valueProp?.includes(value) ? 'selected' : ''}
              >
                <CheckIcon />
              </StyledCheckIconContainer>
            </li>
          );
        })}
      </StyledSelectList>
      <FieldErrorMessage error={error} />
    </StyledSelectListContainer>
  );
}
