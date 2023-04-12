import PropTypes from 'prop-types';
import React from 'react';
import { components } from 'react-select';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import Icon from 'src/components/utils/Icon';
import {
  StyledAsyncSelect,
  StyledAsyncSelectContainer,
} from './SelectAsync.styles';

let debounceTimeoutId;
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

  if (isHidden) {
    return null;
  }

  return (
    <StyledAsyncSelectContainer>
      <StyledAsyncSelect
        id={id}
        components={{ ClearIndicator, DropdownIndicator, MultiValueRemove }}
        classNamePrefix="Select"
        cacheOptions={!!cacheOptions}
        isClearable
        defaultOptions={defaultOptions}
        value={value}
        isMulti={isMulti}
        placeholder={placeholder || 'Sélectionnez...'}
        noOptionsMessage={
          noOptionsMessage ||
          (() => {
            return `Aucun résultat`;
          })
        }
        loadingMessage={loadingMessage}
        loadOptions={(inputValue, callback) => {
          clearTimeout(debounceTimeoutId);
          debounceTimeoutId = setTimeout(() => {
            return loadOptions(inputValue, callback);
          }, 1000);
        }}
        isDisabled={isDisabled}
        isHidden={isHidden}
        onChange={onChange}
        openMenuOnClick={openMenuOnClick}
      />
      <FormValidatorErrorMessage validObj={valid} newInput />
    </StyledAsyncSelectContainer>
  );
}

SelectAsync.propTypes = {
  id: PropTypes.string,
  cacheOptions: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
  ]),
  defaultOptions: PropTypes.oneOfType([
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
      ),
    ]),
    PropTypes.bool,
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
