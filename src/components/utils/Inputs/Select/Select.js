import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import { IconNoSSR } from 'src/components/utils/Icon';
import { isSSR } from 'src/utils/isSSR';
import { StyledSelectContainer } from './Select.styles';

const Select = ({
  id,
  name,
  title,
  valid,
  options,
  onChange,
  showLabel,
  hidden,
}) => {
  const [selectedOption, setSelectedOption] = useState({ value: '' });
  const [optionsOpen, setOptionsOpen] = useState(false);
  const selectId = `${id}-container`;

  useEffect(() => {
    if (!isSSR && id) {
      const container = document.getElementById(selectId);
      document.addEventListener('click', function closeSelect(e) {
        const isClickInside = container.contains(e.target);
        if (optionsOpen && !isClickInside) {
          setOptionsOpen(!optionsOpen);
        }
      });
    }
  }, [id, optionsOpen, selectId, onChange, name]);

  return (
    <StyledSelectContainer
      className={`${hidden ? 'hidden' : ''}`}
      id={selectId}
    >
      {showLabel && title && (
        <label htmlFor={id} className="label-top">
          {title}
        </label>
      )}
      <input type="hidden" value={selectedOption.value} name={name} id={id} />
      <div className="select">
        {!selectedOption.value || (selectedOption.value && optionsOpen) ? (
          <button
            className="placeholder"
            type="button"
            onClick={() => {
              return setOptionsOpen(!optionsOpen);
            }}
          >
            {showLabel || !title ? (
              <div>
                Selectionnez dans la liste{' '}
                <IconNoSSR name="chevron-down" ratio="2.5" />
              </div>
            ) : (
              <>
                <label htmlFor={id}>{title}</label>
                <IconNoSSR name="chevron-down" ratio="2.5" />
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
            <IconNoSSR name="chevron-down" ratio="2.5" />
          </button>
        )}
        {optionsOpen && (
          <ul className="options-container">
            {options?.map((option) => {
              return (
                <li className="option">
                  <button
                    type="button"
                    onClick={() => {
                      setOptionsOpen(!optionsOpen);
                      onChange({
                        target: {
                          name,
                          type: 'select',
                          value: option.value,
                          checked: 0,
                          selectedIndex: 0,
                        },
                      });
                      return setSelectedOption(option);
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
      <FormValidatorErrorMessage validObj={valid} newInput />
    </StyledSelectContainer>
  );
};
Select.defaultProps = {
  valid: undefined,
  // value: undefined,
  // disabled: false,
  onChange: () => {},
  hidden: false,
  title: undefined,
  showLabel: false,
};

Select.propTypes = {
  // disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  title: PropTypes.string,
  showLabel: PropTypes.bool,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
  // value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
      label: PropTypes.string,
    })
  ).isRequired,
  hidden: PropTypes.bool,
};
export default Select;
