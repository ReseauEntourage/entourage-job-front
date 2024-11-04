import React, { useCallback, useEffect } from 'react';
import { LucidIcon } from '../../Icons/LucidIcon';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage';
import { H6 } from 'src/components/utils/Headings';
import { StyledInputLabel } from 'src/components/utils/Inputs/Inputs.styles';
import { Typography } from 'src/components/utils/Typography';
import { COLORS } from 'src/constants/styles';
import {
  StyledCheckIconContainer,
  StyledSelectBlurableSection,
  StyledSelectCard,
  StyledSelectCardBullet,
  StyledSelectCardBulletIcon,
  StyledSelectCardBulletList,
  StyledSelectCardContainer,
  StyledSelectCardContent,
  StyledSelectCardDisabledOverlay,
  StyledSelectCardOption,
} from './SelectCard.styles';
import { SelectCardType } from './SelectCard.types';

export interface SelectCardProps<T extends string>
  extends CommonInputProps<T[], HTMLElement> {
  id: string;
  isMulti?: boolean;
  options: SelectCardType<T>[];
  optionsToDisable?: { message: React.ReactNode; option: T }[];
}

export function SelectCard<T extends string>({
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
  optionsToDisable = [],
}: SelectCardProps<T>) {
  useEffect(() => {
    // Remove disabled options from the default selected values
    const currentValue = valueProp || [];
    const selectedDisabledOption = currentValue.find((value) =>
      optionsToDisable.find((option) => option.option === value)
    );
    if (selectedDisabledOption) {
      onChange(
        currentValue.filter((option) => option !== selectedDisabledOption)
      );
    }
  }, [onChange, optionsToDisable, valueProp]);

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
    <StyledSelectCardContainer disabled={disabled}>
      {showLabel && (
        <StyledInputLabel htmlFor={`form-input-${name}`}>
          {title}
        </StyledInputLabel>
      )}
      <StyledSelectCard data-testid={id}>
        {options?.map(({ value, label, description, bullets }) => {
          const disableOption = optionsToDisable.find(
            ({ option }) => option === value
          );
          return (
            <li
              id={`${id}-${value}`}
              key={`${id}-${value}`}
              data-testid={`${id}-${value}`}
              className={valueProp?.includes(value) ? 'selected' : ''}
            >
              <button
                disabled={!!disableOption}
                onClick={() => handleSelect(value)}
                type="button"
                onBlur={onBlur}
                ref={inputRef}
              >
                <StyledSelectCardOption>
                  <H6 title={label} />
                  <StyledSelectCardContent>
                    <StyledSelectBlurableSection shouldBlur={!!disableOption}>
                      <StyledSelectCardBulletList>
                        {bullets?.map(({ label: bulletLabel, icon }, index) => {
                          return (
                            <StyledSelectCardBullet key={index}>
                              <StyledSelectCardBulletIcon>
                                {icon}
                              </StyledSelectCardBulletIcon>
                              <Typography size="small" color="lighter">
                                {bulletLabel}
                              </Typography>
                            </StyledSelectCardBullet>
                          );
                        })}
                      </StyledSelectCardBulletList>
                      <Typography>{description}</Typography>
                    </StyledSelectBlurableSection>
                    {disableOption && (
                      <StyledSelectCardDisabledOverlay>
                        <LucidIcon
                          name="TriangleAlert"
                          size={30}
                          color={COLORS.primaryBlue}
                        />
                        {typeof disableOption.message === 'string' ? (
                          <Typography size="small" weight="bold">
                            {disableOption.message}
                          </Typography>
                        ) : (
                          disableOption.message
                        )}
                      </StyledSelectCardDisabledOverlay>
                    )}
                  </StyledSelectCardContent>
                </StyledSelectCardOption>
                <StyledCheckIconContainer
                  className={valueProp?.includes(value) ? 'selected' : ''}
                >
                  <LucidIcon name="Check" />
                </StyledCheckIconContainer>
              </button>
            </li>
          );
        })}
      </StyledSelectCard>
      <FieldErrorMessage error={error} />
    </StyledSelectCardContainer>
  );
}
