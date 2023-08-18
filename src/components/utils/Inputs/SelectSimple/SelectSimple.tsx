import React, { useEffect, useState } from 'react';
import { StyledInputLabel } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
import { Icon } from 'src/components/utils/Icon';
import { FilterConstant } from 'src/constants/utils';
import { useCloseOnClickOutsideComponent } from 'src/hooks/useCloseOnClickOutsideComponent';
import { StyledSelectContainer } from './SelectSimple.styles';

interface SelectSimpleProps<T extends string | number | boolean>
  extends CommonInputProps<T, HTMLInputElement> {
  options: FilterConstant<T>[];
}

export function SelectSimple<T extends string | number | boolean>({
  id,
  name,
  title,
  error,
  options,
  onChange,
  onBlur,
  showLabel = false,
  hidden = false,
  disabled = false,
  value,
  inputRef,
}: SelectSimpleProps<T>) {
  const [selectedOption, setSelectedOption] = useState<FilterConstant<T>>({
    label: '',
    value: null,
  });

  useEffect(() => {
    const optionToSelect = options.find(
      ({ value: optionValue }) => optionValue === value
    );
    setSelectedOption(optionToSelect || { value: null, label: '' });
  }, [options, value]);

  const {
    componentId: selectId,
    isOpen: optionsOpen,
    setIsOpen: setOptionsOpen,
  } = useCloseOnClickOutsideComponent(id);

  if (hidden) {
    return null;
  }

  return (
    <StyledSelectContainer id={selectId} disabled={disabled}>
      {showLabel && (
        <StyledInputLabel htmlFor={`form-input-${name}`}>
          {title}
        </StyledInputLabel>
      )}
      <input
        type="hidden"
        value={(selectedOption.value || '').toString()}
        name={name}
        id={id}
        onBlur={onBlur}
        ref={inputRef}
      />
      <div className="select">
        {(!selectedOption.value && selectedOption.value !== 0) ||
        (selectedOption.value && optionsOpen) ? (
          <button
            className="placeholder"
            type="button"
            onClick={() => setOptionsOpen(!optionsOpen)}
            data-testid={id}
            disabled={disabled}
          >
            {showLabel || !title ? (
              <div>
                Selectionnez dans la liste{' '}
                <Icon name="chevron-down" ratio="2.5" />
              </div>
            ) : (
              <>
                <label htmlFor={id}>{title}</label>
                <Icon name="chevron-down" ratio="2.5" />
              </>
            )}
          </button>
        ) : (
          <button
            className="selected-value"
            type="button"
            onClick={() => {
              return setOptionsOpen(!optionsOpen);
            }}
          >
            {selectedOption.label}
            <Icon name="chevron-down" ratio="2.5" />
          </button>
        )}
        {optionsOpen && (
          <ul className="options-container">
            {options?.map((option) => {
              const optionId = `select-option-${
                typeof option.value === 'string'
                  ? option.value.replace(/\s+/g, '')
                  : option.value
              }`;

              return (
                <li className="option" key={option.value.toString()}>
                  <button
                    type="button"
                    data-testid={optionId}
                    id={optionId}
                    onClick={() => {
                      setOptionsOpen(!optionsOpen);
                      onChange(option.value);
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <FieldErrorMessage error={error} />
    </StyledSelectContainer>
  );
}
