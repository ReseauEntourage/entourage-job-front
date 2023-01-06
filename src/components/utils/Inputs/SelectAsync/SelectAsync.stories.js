import React from 'react';
import AsyncSelect from 'react-select/async';
import Select from '.';

export default {
  title: 'Select Async',
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

const filterOptions = (inputValue) => {
  return options.filter((i) => {
    return i.label.toLowerCase().includes(inputValue.toLowerCase());
  });
};

const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    callback(filterOptions(inputValue));
  }, 1000);
};

// export function Perso() {
//   return (
//     <Select
//       id="test"
//       cacheOptions
//       title="title / placeholder"
//       loadOptions={loadOptions}
//     />
//   );
// }

export function Default() {
  return (
    <AsyncSelect
      id="test"
      cacheOptions
      title="title / placeholder"
      loadOptions={loadOptions}
    />
  );
}
