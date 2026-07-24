import React, { useCallback } from 'react';
import { COLORS } from '@/src/constants/styles';
import { FieldErrorMessage } from '@/src/features/forms/fields/FieldErrorMessage';
import { LucidIcon } from '../../Icons';
import { Skeleton } from '../../Skeleton/Skeleton';
import { StyledInputLabel } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import {
  StyledSelectList,
  StyledSelectListContainer,
  StyledButton,
  StyledCheckIconContainer,
  StyledListOptionContainer,
  StyledSelectListGroup,
  StyledSelectListGroupLabel,
} from './SelectList.styles';
import { SelectListOptions, isGroupedOptions } from './SelectList.types';

export type SelectListVariant = 'default' | 'inline' | 'grid';

interface SelectListProps<T extends string> extends CommonInputProps<
  T[],
  HTMLElement
> {
  id: string;
  isMulti?: boolean;
  options: SelectListOptions<T>;
  estimatedOptionLength?: number;
  isLoading?: boolean;
  variant?: SelectListVariant;
}

export const SelectList = <T extends string>({
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
  estimatedOptionLength = 3,
  isLoading = false,
  variant = 'default',
}: SelectListProps<T>) => {
  const handleSelect = useCallback(
    (value: T) => {
      const currentValue = valueProp || [];
      if (currentValue.includes(value)) {
        onChange(currentValue.filter((option) => option !== value));
      } else if (isMulti) {
        onChange([...currentValue, value]);
      } else {
        onChange([value]);
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
      <StyledSelectList data-testid={id} $variant={variant}>
        {isLoading && (
          <Skeleton height="90px" count={estimatedOptionLength} inverted />
        )}
        {isGroupedOptions(options)
          ? options.map((group, groupIndex) => (
              <StyledSelectListGroup key={groupIndex}>
                <StyledSelectListGroupLabel>
                  {group.label}
                </StyledSelectListGroupLabel>
                {group.options.map(({ value, label }) => (
                  <StyledButton
                    id={`${id}-${value}`}
                    key={`${id}-${value}`}
                    data-testid={`${id}-${value}`}
                    onClick={() => handleSelect(value)}
                    type="button"
                    onBlur={onBlur}
                    ref={inputRef}
                    $selected={valueProp?.includes(value)}
                  >
                    <StyledCheckIconContainer
                      $selected={valueProp?.includes(value)}
                    >
                      <LucidIcon name="Check" color={COLORS.white} />
                    </StyledCheckIconContainer>
                    <StyledListOptionContainer>
                      {label}
                    </StyledListOptionContainer>
                  </StyledButton>
                ))}
              </StyledSelectListGroup>
            ))
          : options.map(({ value, label }) => (
              <StyledButton
                id={`${id}-${value}`}
                key={`${id}-${value}`}
                data-testid={`${id}-${value}`}
                onClick={() => handleSelect(value)}
                type="button"
                onBlur={onBlur}
                ref={inputRef}
                $selected={valueProp?.includes(value)}
              >
                <StyledCheckIconContainer
                  $selected={valueProp?.includes(value)}
                >
                  <LucidIcon name="Check" color={COLORS.white} />
                </StyledCheckIconContainer>
                <StyledListOptionContainer>{label}</StyledListOptionContainer>
              </StyledButton>
            ))}
      </StyledSelectList>
      {error && <FieldErrorMessage error={error} />}
    </StyledSelectListContainer>
  );
};
