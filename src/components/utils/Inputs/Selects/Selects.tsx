import React from 'react';
import { components } from 'react-select';
import ChevronDownIcon from 'assets/icons/chevron-down.svg';
import CloseIcon from 'assets/icons/close.svg';

export const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDownIcon />
    </components.DropdownIndicator>
  );
};

export const ClearIndicator = (props) => {
  return (
    <components.ClearIndicator {...props}>
      <CloseIcon />
    </components.ClearIndicator>
  );
};

export const MultiValueRemove = (props) => {
  return (
    <components.MultiValueRemove {...props}>
      <CloseIcon width={10} heigth={10} />
    </components.MultiValueRemove>
  );
};
