import React from 'react';
import { Skeleton } from '../../Skeleton/Skeleton';
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
  options: Option[];
  selection: string | null;
  onChange: (value: string) => void;
  isLoading?: boolean;
  estimatedOptionLength?: number;
}

export const RadioGroup = ({
  options,
  selection,
  onChange,
  isLoading = false,
  estimatedOptionLength = 3,
}: RadioGroupProps) => {
  return (
    <StyledRadioGroupList>
      {isLoading && <Skeleton height="90px" count={estimatedOptionLength} />}
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
