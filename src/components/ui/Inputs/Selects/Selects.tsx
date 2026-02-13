import React from 'react';
import { components } from 'react-select';
import { LucidIcon } from '../../Icons/LucidIcon';

export const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <LucidIcon name="ChevronDown" />
    </components.DropdownIndicator>
  );
};

export const ClearIndicator = (props) => {
  return (
    <components.ClearIndicator {...props}>
      <LucidIcon name="X" size={14} />
    </components.ClearIndicator>
  );
};

export const MultiValueRemove = (props) => {
  return (
    <components.MultiValueRemove {...props}>
      <LucidIcon name="X" size={14} />
    </components.MultiValueRemove>
  );
};
