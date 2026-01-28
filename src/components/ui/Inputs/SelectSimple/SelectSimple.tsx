import React, { useEffect, useState } from 'react';
import { LucidIcon } from '../../Icons/LucidIcon';
import { StyledInputLabel, StyledInputLabelOptional } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FilterConstant } from 'src/constants/utils';
import { FieldErrorMessage } from 'src/features/forms/fields/FieldErrorMessage/FieldErrorMessage';
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
  showOptional = false,
  hidden = false,
  disabled = false,
  placeholder,
  value,
  inputRef,
}: SelectSimpleProps<T>) {
  const [selectedOption, setSelectedOption] = useState<FilterConstant<T>>(
    {} as FilterConstant<T>
  );

  useEffect(() => {
    const optionToSelect = options.find(
      ({ value: optionValue }) => optionValue === value
    );
    setSelectedOption(optionToSelect || ({} as FilterConstant<T>));
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
          {showOptional && (
            <StyledInputLabelOptional>
              &bull; Facultatif
            </StyledInputLabelOptional>
          )}
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
                {placeholder || 'Sélectionnez dans la liste...'}{' '}
                <LucidIcon name="ChevronDown" />
              </div>
            ) : (
              <>
                <label htmlFor={id}>{title}</label>
                <LucidIcon name="ChevronDown" />
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
            <LucidIcon name="ChevronDown" />
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
      {error && <FieldErrorMessage error={error} />}
    </StyledSelectContainer>
  );
}
