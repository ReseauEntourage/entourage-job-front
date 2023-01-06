import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import { IconNoSSR } from 'src/components/utils/Icon';
import { isSSR } from 'src/utils/isSSR';
import { StyledSelectContainer } from './Select.styles';

// import { isSSR } from 'src/utils/isSSR';
// import { isSSR } from '../../../../utils/isSSR';

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
  const [selectedOption, setSelectedOption] = useState({});
  const [optionsOpen, setOptionsOpen] = useState(false);
  // useEffect(() => {
  //   onChange(selectedOption.value);
  // }, [selectedOption, onChange, optionsOpen]);
  // if (!isSSR) {
  //   document.body.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     if (optionsOpen && !e.target.className === 'placeholder') {
  //       setOptionsOpen(false);
  //     }
  //   });
  // }
  useEffect(() => {
    if (!isSSR && id) {
      const input = document.getElementById(`${id}`);
      const MutationObserver =
        window.MutationObserver || window.WebKitMutationObserver;
      const myObserver = new MutationObserver(() => {
        console.log('triggered', id);
      });
      const changeOfValueConfig = { attributeFilter: ['value'] };
      myObserver.observe(input, changeOfValueConfig);
    }
  }, [id]);

  return (
    <StyledSelectContainer className={`${hidden ? 'hidden' : ''}`}>
      <input
        type="hidden"
        value={selectedOption.value}
        onInput={(event) => {
          console.log(event);
          return onChange(event);
        }}
        name={name}
        id={id}
      />
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
