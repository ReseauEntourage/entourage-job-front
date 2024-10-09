import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Typography } from '../../Typography';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage';
import { StyledRadioContainer } from './Radio.styles';
import { RadioComponentProps } from './Radio.types';

const uuidValue = uuid();

export function Radio({
  options,
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

  useEffect(() => {
    for (let i = 0; i < options.length; i += 1) {
      if (options[i].checked) {
        setCheckedRadio(i);
      }
    }
  }, [options]);

  const onHandleRadio = useCallback(
    (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
      setCheckedRadio(i);
      onChange(e.target.value);
    },
    [onChange]
  );

  useEffect(() => {
    const optionIndexToSelect = options.findIndex(
      ({ value: optionValue }) => optionValue === valueProp
    );
    setCheckedRadio(optionIndexToSelect);
  }, [options, valueProp]);

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
        <Typography weight="bold" size="large">
          {title}
        </Typography>
      )}
      {subtitle && <legend>{subtitle}</legend>}
      <div className="inputs-container">
        {options
          .filter(({ filterData }) => {
            return !(filter && filterData && filter !== filterData);
          })
          .slice(0, limit)
          .map(({ inputId, label, value }, i) => {
            if (!inputId) inputId = `radio-${value.replace(/\s+/g, '')}`;
            return (
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
                  disabled={disabled}
                  onBlur={onBlur}
                  ref={inputRef}
                />
                {label}
              </label>
            );
          })}
      </div>
      <FieldErrorMessage error={error} />
    </StyledRadioContainer>
  );
}
