import React, { ChangeEvent, useEffect, useState } from 'react';
import { FormValidatorErrorMessage } from 'src/components/forms/FormValidatorErrorMessage';
import { Icon } from 'src/components/utils/Icon';
import { useCloseOnClickOutsideComponent } from 'src/hooks/useCloseOnClickOutsideComponent';
import { StyledSelectContainer } from './Select.styles';

interface SelectProps {
  id: string;
  name: string;
  title?: string;
  showLabel?: boolean;
  onChange: (
    e: ChangeEvent<HTMLSelectElement> & {
      target: ChangeEvent<HTMLSelectElement>['target'] & { checked: number };
    } /* {
    target: {
      name: string;
      type: 'select';
      value: string | number;
      checked: 0;
    };
  } */
  ) => void;
  valid?: {
    isInvalid: boolean;
    message: string;
  };
  value?: string | number;
  options: {
    value: string;
    label?: string;
  }[];
  hidden?: boolean;
}

export function Select({
  id,
  name,
  title,
  valid,
  options,
  onChange,
  showLabel = false,
  hidden = false,
  value,
}: SelectProps) {
  const [selectedOption, setSelectedOption] = useState<{
    value: string | number;
    label?: string;
  }>({ value: '' });

  useEffect(() => {
    const optionToSelect = options.find(
      ({ value: optionValue }) => optionValue === value
    );
    setSelectedOption(optionToSelect || { value: '' });
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
    <StyledSelectContainer id={selectId}>
      {showLabel && title && (
        <label htmlFor={id} className="label-top">
          {title}
        </label>
      )}
      <input type="hidden" value={selectedOption.value} name={name} id={id} />
      <div className="select">
        {(!selectedOption.value && selectedOption.value !== 0) ||
        (selectedOption.value && optionsOpen) ? (
          <button
            className="placeholder"
            type="button"
            onClick={() => {
              return setOptionsOpen(!optionsOpen);
            }}
            data-testid={id}
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
                <li className="option" key={option.value}>
                  <button
                    type="button"
                    data-testid={optionId}
                    id={optionId}
                    onClick={() => {
                      setOptionsOpen(!optionsOpen);
                      onChange({
                        target: {
                          name,
                          type: 'select',
                          value: option.value,
                          checked: 0,
                        },
                      } as ChangeEvent<HTMLSelectElement> & {
                        target: ChangeEvent<HTMLSelectElement>['target'] & {
                          checked: number;
                        };
                      });
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
      <FormValidatorErrorMessage validObj={valid} />
    </StyledSelectContainer>
  );
}
