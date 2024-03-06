import React, { useCallback } from 'react';
import CheckIcon from 'assets/icons/check.svg';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage';
import { H6 } from 'src/components/utils/Headings';
import { StyledInputLabel } from 'src/components/utils/Inputs/Inputs.styles';
import { Typography } from 'src/components/utils/Typography';
import { Unarray } from 'src/utils/Types';
import {
  StyledCheckIconContainer,
  StyledSelectBlurableSection,
  StyledSelectCard,
  StyledSelectCardBullet,
  StyledSelectCardBulletIcon,
  StyledSelectCardBulletList,
  StyledSelectCardContainer,
  StyledSelectCardDisabledOverlay,
  StyledSelectCardOption,
} from './SelectCard.styles';
import { SelectCardType } from './SelectCard.types';

interface SelectCardProps<T extends string[]>
  extends CommonInputProps<T, HTMLElement> {
  id: string;
  isMulti?: boolean;
  options: SelectCardType<Unarray<T>>[];
  optionsToDisable?: { message: string; option: Unarray<T> }[];
}

export function SelectCard<T extends string[]>({
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
    <StyledSelectCardContainer disabled={disabled}>
      {showLabel && (
        <StyledInputLabel htmlFor={`form-input-${name}`}>
          {title}
        </StyledInputLabel>
      )}
      <StyledSelectCard data-testid={id}>
        {options.map(({ value, label, description, bullets }) => {
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
                  <StyledSelectBlurableSection shouldBlur={!!disableOption}>
                    {disableOption && (
                      <StyledSelectCardDisabledOverlay>
                        <Typography size="small" color="lighter">
                          {disableOption.message}
                        </Typography>
                      </StyledSelectCardDisabledOverlay>
                    )}
                    <StyledSelectCardBulletList>
                      {bullets.map(({ label: bulletLabel, icon }) => {
                        return (
                          <StyledSelectCardBullet>
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
                </StyledSelectCardOption>
                <StyledCheckIconContainer
                  className={valueProp?.includes(value) ? 'selected' : ''}
                >
                  <CheckIcon />
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
