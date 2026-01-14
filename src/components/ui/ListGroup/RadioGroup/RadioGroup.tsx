import React from 'react';
import {
  StyledInput,
  StyledRadioGroupItem,
  StyledRadioGroupList,
} from './RadioGroup.styles';

export type Option = {
  value: string;
  content: React.ReactNode;
};

export interface RadioGroupProps {
  radioSize?: 'small' | 'large';
  options: Option[];
  selection: string | null;
  onChange: (value: string) => void;
}

export const RadioGroup = ({
  options,
  selection,
  onChange,
}: RadioGroupProps) => {
  return (
    <StyledRadioGroupList>
      {options.map((option, index) => (
        <StyledRadioGroupItem
          key={index}
          onClick={() => onChange(option.value)}
        >
          <StyledInput
            type="radio"
            id={`radio-${index}`}
            name="radio-group"
            value={option.value}
            checked={selection === option.value}
            onChange={() => onChange(option.value)}
          />
          <label htmlFor={`radio-${index}`}>{option.content}</label>
        </StyledRadioGroupItem>
      ))}
    </StyledRadioGroupList>
  );
};
