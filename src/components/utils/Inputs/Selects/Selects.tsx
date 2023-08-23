import React from 'react';
import { components } from 'react-select';
import { Icon } from 'src/components/utils/Icon';

export const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon name="chevron-down" ratio={0.9} />
    </components.DropdownIndicator>
  );
};

export const ClearIndicator = (props) => {
  return (
    <components.ClearIndicator {...props}>
      <Icon name="close" ratio={0.8} />
    </components.ClearIndicator>
  );
};

export const MultiValueRemove = (props) => {
  return (
    <components.MultiValueRemove {...props}>
      <Icon name="close" ratio={0.6} />
    </components.MultiValueRemove>
  );
};
