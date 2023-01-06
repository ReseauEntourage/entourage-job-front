import React from 'react';
import { StyledAsyncSelect } from './SelectAsync.styles';

const SelectAsync = ({
  id,
  cacheOptions,
  value,
  isMulti,
  placeholder,
  noOptionsMessage,
  loadOptions,
  isDisabled,
  isHidden,
  onChange,
  openMenuOnClick,
}) => {
  return (
    <StyledAsyncSelect
      id={id}
      cacheOptions={cacheOptions}
      isClearable
      defaultOptions
      value={value}
      isMulti={isMulti}
      placeholder={placeholder}
      noOptionsMessage={noOptionsMessage}
      loadOptions={loadOptions}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onChange={onChange}
      openMenuOnClick={openMenuOnClick}
    />
  );
};

export default SelectAsync;
