import React, { useCallback } from 'react';
import CheckIcon from 'assets/icons/check.svg';
import { AnyCantFix } from 'src/utils/Types';
import {
  StyledCheckIconContainer,
  StyledSelectList,
} from './SelectList.styles';

interface SelectListProps {
  id: string;
  isMulti?: boolean;
  options: {
    value: string;
    component: React.ReactNode;
  }[];
  values?: AnyCantFix[]; // should be an array of strings
  onChange: (value: AnyCantFix[]) => void;
}

export function SelectList({
  options,
  id,
  isMulti = true,
  values,
  onChange,
}: SelectListProps) {
  const handleSelect = useCallback(
    (value: string) => {
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
