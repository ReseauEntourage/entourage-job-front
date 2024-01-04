import React, { useCallback, useEffect, useState } from 'react';
import CheckIcon from 'assets/icons/check.svg';
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
  defaultValues?: string[];
  onChange: (value: string[]) => void;
}

export function SelectList({
  options,
  id,
  isMulti = true,
  defaultValues,
  onChange,
}: SelectListProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    defaultValues || []
  );

  const handleSelect = useCallback(
    (value: string) => {
      if (selectedOptions.includes(value)) {
        setSelectedOptions(
          selectedOptions.filter((option) => option !== value)
        );
      } else if (isMulti) {
        setSelectedOptions([...selectedOptions, value]);
      } else {
        setSelectedOptions([value]);
      }
    },
    [selectedOptions, isMulti]
  );

  useEffect(() => {
    onChange(selectedOptions);
  }, [selectedOptions, onChange]);

  return (
    <StyledSelectList id={id}>
      {options.map(({ value, component }, i) => {
        return (
          <li
            key={i}
            className={selectedOptions.includes(value) ? 'selected' : ''}
          >
            <button onClick={() => handleSelect(value)} type="button">
              {component}
            </button>
            <StyledCheckIconContainer
              className={selectedOptions.includes(value) ? 'selected' : ''}
            >
              <CheckIcon />
            </StyledCheckIconContainer>
          </li>
        );
      })}
    </StyledSelectList>
  );
}
