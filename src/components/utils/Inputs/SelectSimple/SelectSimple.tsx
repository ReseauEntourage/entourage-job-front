import React, { useEffect, useState } from 'react';
import ChevronDownIcon from 'assets/icons/chevron-down.svg';
import { StyledInputLabel } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
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
  placeholder,
  value,
  inputRef,
}: SelectSimpleProps<T>) {
  const [selectedOption, setSelectedOption] = useState<FilterConstant<T>>({
    label: '',

    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    value: null,
  });

  useEffect(() => {
    const optionToSelect = options.find(
      ({ value: optionValue }) => optionValue === value
    );
    setSelectedOption(
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      optionToSelect || { value: null, label: '' }
    );
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
                {placeholder || 'Selectionnez dans la liste...'}{' '}
                <ChevronDownIcon width={15} height={15} />
              </div>
            ) : (
              <>
                <label htmlFor={id}>{title}</label>
                <ChevronDownIcon width={15} height={15} />
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
            <ChevronDownIcon width={15} height={15} />
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
