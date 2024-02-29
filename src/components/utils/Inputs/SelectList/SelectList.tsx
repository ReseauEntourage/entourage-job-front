import React, { useCallback } from 'react';
import CheckIcon from 'assets/icons/check.svg';
import { CommonInputProps } from '../Inputs.types';
import { H6 } from 'src/components/utils/Headings';
import {
  StyledCheckIconContainer,
  StyledSelectList,
  StyledSelectOption,
} from './SelectList.styles';
import { SelectListType } from './SelectList.types';

interface SelectListProps<T extends string[]>
  extends CommonInputProps<T, HTMLSelectElement> {
  id: string;
  isMulti?: boolean;
  options: SelectListType[];
}

export function SelectList<T extends string[]>({
  id,
  value: valueProp,
  onChange,
  onBlur,
  options,
  isMulti = true,
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

  return (
    <StyledSelectList id={id}>
      {options.map(({ value, label, description, icon }) => {
        return (
          <li
            id={`${id}-${value}`}
            key={`${id}-${value}`}
            className={valueProp?.includes(value) ? 'selected' : ''}
          >
            <button
              onClick={() => handleSelect(value)}
              type="button"
              onBlur={onBlur}
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
  );
}
