import React, { useCallback } from 'react';
import CheckIcon from 'assets/icons/check.svg';
import {
  StyledCheckIconContainer,
  StyledSelectList,
} from './SelectList.styles';

interface SelectListProps<T extends string> {
  id: string;
  isMulti?: boolean;
  options: {
    value: T;
    component: React.ReactNode;
  }[];
  values?: T[];
  onChange: (value: T[]) => void;
}

export function SelectList<T extends string>({
  options,
  id,
  isMulti = true,
  values,
  onChange,
}: SelectListProps<T>) {
  const handleSelect = useCallback(
    (value: T) => {
      if (!values) return;
      if (values.includes(value)) {
        onChange(values.filter((option) => option !== value));
      } else if (isMulti) {
        onChange([...values, value]);
      } else {
        onChange([value]);
      }
    },
    [values, isMulti, onChange]
  );

  return (
    <StyledSelectList id={id}>
      {options.map(({ value, component }, i) => {
        return (
          <li key={i} className={values?.includes(value) ? 'selected' : ''}>
            <button onClick={() => handleSelect(value)} type="button">
              {component}
            </button>
            <StyledCheckIconContainer
              className={values?.includes(value) ? 'selected' : ''}
            >
              <CheckIcon />
            </StyledCheckIconContainer>
          </li>
        );
      })}
    </StyledSelectList>
  );
}
