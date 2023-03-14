import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import { IconNoSSR } from 'src/components/utils/Icon';
import { useCloseOnClickOutsideComponent } from 'src/hooks/useCloseOnClickOutsideComponent.ts';
import { StyledSelectContainer } from './Select.styles';

const Select = ({
  id,
  name,
  title,
  valid,
  options,
  // value,
  onChange,
  // disabled,
  hidden,
}) => {
  const [selectedOption, setSelectedOption] = useState({ value: '' });
  const {
    componentId: selectId,
    isOpen: optionsOpen,
    setIsOpen: setOptionsOpen,
  } = useCloseOnClickOutsideComponent(id);

  return (
    <StyledSelectContainer
      className={`${hidden ? 'hidden' : ''}`}
      id={selectId}
    >
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
            {title ? (
              <label className="" htmlFor={id}>
                {title}
              </label>
            ) : null}
            <IconNoSSR name="chevron-down" ratio="2.5" />
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
      <FormValidatorErrorMessage validObj={valid} />
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
};

Select.propTypes = {
  // disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  title: PropTypes.string,
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
