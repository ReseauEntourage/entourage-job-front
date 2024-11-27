import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import WarningIcon from 'assets/icons/warning.svg';
import { Text } from '../../Text';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage';
import { COLORS } from 'src/constants/styles';
import {
  StyledRadioContainer,
  StyledRadioDisabledOverlay,
} from './Radio.styles';
import { RadioComponentProps } from './Radio.types';

const uuidValue = uuid();

export function Radio({
  options,
  optionsToDisable = [],
  id,
  title,
  subtitle,
  name,
  filter,
  onChange,
  onBlur,
  hidden = false,
  disabled = false,
  value: valueProp,
  limit = options.length,
  inputRef,
  error,
}: RadioComponentProps) {
  const [checkedRadio, setCheckedRadio] = useState<number>();

  const onHandleRadio = useCallback(
    (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
      setCheckedRadio(i);
      onChange(e.target.value);
    },
    [onChange]
  );

  useEffect(() => {
    const optionIndexToSelect = options.findIndex(
      // value prop can be an array or a string
      (option) => option.value === valueProp || option.value === valueProp?.[0]
    );
    setCheckedRadio(optionIndexToSelect);
  }, [setCheckedRadio, options, valueProp]);

  if (hidden) {
    return null;
  }

  return (
    <StyledRadioContainer
      id={id}
      data-testid={`test-${id}`}
      disabled={disabled}
    >
      {title && (
        <Text weight="bold" size="large">
          {title}
        </Text>
      )}
      {subtitle && <legend>{subtitle}</legend>}
      <div className="inputs-container">
        {options
          .filter(({ filterData }) => {
            return !(filter && filterData && filter !== filterData);
          })
          .slice(0, limit)
          .map(({ inputId, label, value }, i) => {
            const disabledOption = optionsToDisable.find(
              ({ option }) => option === value
            );
            if (!inputId) inputId = `radio-${value.replace(/\s+/g, '')}`;
            return (
              <div key={`$div-${i}-${uuidValue}`}>
                <label
                  htmlFor={inputId}
                  className={i === checkedRadio ? 'checked' : ''}
                  key={`${i}-${uuidValue}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <input
                    type="radio"
                    value={value}
                    id={inputId}
                    data-testid={inputId}
                    name={name}
                    checked={i === checkedRadio}
                    onChange={(e) => onHandleRadio(i, e)}
                    disabled={!!disabledOption}
                    onBlur={onBlur}
                    ref={inputRef}
                  />
                  {label}
                </label>
                {disabledOption && (
                  <StyledRadioDisabledOverlay>
                    <WarningIcon
                      width={30}
                      height={30}
                      color={COLORS.primaryBlue}
                    />
                    {typeof disabledOption.message === 'string' ? (
                      <Text size="small" weight="bold">
                        {disabledOption.message}
                      </Text>
                    ) : (
                      disabledOption.message
                    )}
                  </StyledRadioDisabledOverlay>
                )}
              </div>
            );
          })}
      </div>
      <FieldErrorMessage error={error} />
    </StyledRadioContainer>
  );
}
