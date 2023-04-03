import React from 'react';
import Select from './Select';

export default {
  title: 'Select',
  parameters: {
    component: null,
  },
};

const options = [
  {
    value: 'first option',
    label: 'first option',
  },
  {
    value: 'second option',
    label: 'second option',
  },
  {
    value: 'third option',
    label: 'third option',
  },
  {
    value: 'forth option',
    label: 'forth option',
  },
  {
    value: 'fifth option',
    label: 'fifth option',
  },
  {
    value: 'sixth option',
    label: 'sixth option',
  },
];

export function Default() {
  return <Select title="title / placeholder" options={options} />;
}

export function WithLabel() {
  return (
    <Select
      title="A choice to make between different options"
      options={options}
      showLabel
    />
  );
}
