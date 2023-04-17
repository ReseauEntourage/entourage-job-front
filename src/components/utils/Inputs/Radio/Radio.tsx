import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { StyledRadioContainer } from './Radio.styles';
import { RadioComponentType } from './Radio.types';

const uuidValue = uuid();

export function Radio({
  options,
  id,
  legend,
  name,
  filter,
  onChange,
  errorMessage,
  hidden,
  value: valueProp,
}: RadioComponentType) {
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
      onChange(e);
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
    <StyledRadioContainer id={id} data-testid={`test-${id}`}>
      {typeof options === null ? (
        <legend>{errorMessage}</legend>
      ) : (
        <>
          <legend>{legend}</legend>
          <div className="inputs-container">
            {options.map(({ inputId, label, value, filterData }, i) => {
              if (filter && filterData && filter !== filterData) return null;
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
                    onChange={(e) => {
                      onHandleRadio(i, e);
                    }}
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </>
      )}
    </StyledRadioContainer>
  );
}
