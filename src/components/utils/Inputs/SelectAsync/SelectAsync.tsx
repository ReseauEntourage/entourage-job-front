import PropTypes from 'prop-types';
import React from 'react';
import ReactSelect, { components } from 'react-select';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import Icon from 'src/components/utils/Icon';
import {
  StyledAsyncSelect,
  StyledAsyncSelectContainer,
} from './SelectAsync.styles';

export function SelectAsync({
  id,
  cacheOptions,
  value,
  isMulti,
  placeholder,
  noOptionsMessage,
  loadingMessage,
  loadOptions,
  isDisabled,
  isHidden,
  onChange,
  openMenuOnClick,
  valid,
  defaultOptions,
}) {
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <Icon name="chevron-down" ratio={0.9} />
      </components.DropdownIndicator>
    );
  };

  const ClearIndicator = (props) => {
    return (
      <components.ClearIndicator {...props}>
        <Icon name="close" ratio={0.8} />
      </components.ClearIndicator>
    );
  };

  const MultiValueRemove = (props) => {
    return (
      <components.MultiValueRemove {...props}>
        <Icon name="close" ratio={0.6} />
      </components.MultiValueRemove>
    );
  };
  return (
    !isHidden && (
      <StyledAsyncSelectContainer>
        <StyledAsyncSelect
          id={id}
          components={{ ClearIndicator, DropdownIndicator, MultiValueRemove }}
          classNamePrefix="Select"
          cacheOptions={cacheOptions}
          isClearable
          defaultOptions={defaultOptions}
          value={value}
          isMulti={isMulti}
          placeholder={placeholder}
          noOptionsMessage={noOptionsMessage}
          loadingMessage={loadingMessage}
          loadOptions={loadOptions}
          isDisabled={isDisabled}
          isHidden={isHidden}
          onChange={onChange}
          openMenuOnClick={openMenuOnClick}
        />
        <FormValidatorErrorMessage validObj={valid} newInput />
      </StyledAsyncSelectContainer>
    )
  );
}

SelectAsync.propTypes = {
  id: PropTypes.string,
  cacheOptions: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultOptions: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ]),
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string,
  noOptionsMessage: PropTypes.func,
  loadingMessage: PropTypes.func,
  loadOptions: PropTypes.func,
  isDisabled: PropTypes.bool,
  isHidden: PropTypes.bool,
  onChange: PropTypes.func,
  openMenuOnClick: PropTypes.bool,
  valid: PropTypes.bool,
};

SelectAsync.defaultProps = {
  id: undefined,
  cacheOptions: false,
  value: undefined,
  isMulti: false,
  placeholder: undefined,
  noOptionsMessage: () => null,
  loadingMessage: () => null,
  loadOptions: () => null,
  isDisabled: false,
  isHidden: false,
  onChange: () => null,
  openMenuOnClick: false,
  defaultOptions: true,
  valid: false,
};
