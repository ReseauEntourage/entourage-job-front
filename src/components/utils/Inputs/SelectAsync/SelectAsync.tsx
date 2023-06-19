import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { components } from 'react-select';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import Icon from 'src/components/utils/Icon';
import { AnyToFix } from 'src/utils/Types';
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
  defaultOptions: defaultOptionsProps,
}) {
  const [defaultOptions, setDefaultOptions] =
    useState<{ label: string; value: AnyToFix }[]>(defaultOptionsProps);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedLoadOptions = useCallback(
    (inputValue, callback) => {
      setIsLoading(true);
      clearTimeout(debounceTimeoutId);
      debounceTimeoutId = setTimeout(() => {
        loadOptions(inputValue, (options) => {
          callback(options);
          setIsLoading(false);
        });
      }, 1000);
    },
    [loadOptions]
  );

  const onFocus = useCallback(() => {
    setDefaultOptions([]);
    setIsLoading(true);
    loadOptions('', (options) => {
      setDefaultOptions(options);
      setIsLoading(false);
    });
  }, [loadOptions]);

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
        onFocus={onFocus}
        components={{ ClearIndicator, DropdownIndicator, MultiValueRemove }}
        classNamePrefix="Select"
        cacheOptions={!!cacheOptions}
        isClearable
        isLoading={isLoading}
        defaultOptions={defaultOptions}
        value={value || null}
        isMulti={isMulti}
        placeholder={placeholder || 'Sélectionnez...'}
        noOptionsMessage={
          noOptionsMessage ||
          (() => {
            return `Aucun résultat`;
          })
        }
        loadingMessage={loadingMessage}
        loadOptions={debouncedLoadOptions}
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
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
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
  valid: undefined,
};
