import React, { useState, useEffect } from 'react';
import { uuid } from 'uuid/v4';
import { StyledRadioContainer } from './Radio.styles';
import { RadioComponentType } from './Radio.type';

const Radio = ({
  options,
  id,
  legend,
  name,
  filter,
  onChange,
  errorMessage,
  hidden,
}: RadioComponentType) => {
  const [checkedRadio, setCheckedRadio] = useState<number>();

  useEffect(() => {
    for (let i = 0; i < options.length; i += 1) {
      if (options[i].checked) {
        setCheckedRadio(i);
      }
    }
  }, [options]);

  const onHandleRadio = (
    i: number,
    e: React.MouseEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>
  ) => {
    setCheckedRadio(i);
    onChange(e);
  };

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
                  key={`${i}-${uuid}`}
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
};

export default Radio;
