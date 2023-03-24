import React from 'react';
import Radio from './Radio';

export default {
  title: 'Radio',
  parameters: {
    component: null,
  },
};

export function Default() {
  return (
    <Radio
      legend="An exclusive choice to make (default to one)"
      name="radio"
      id="default"
      onChange={() => {
        // eslint-disable-next-line no-console
        console.log('changed');
      }}
      options={[
        {
          inputId: 'one',
          label: "I'll take one",
          value: 'one',
          checked: true,
        },
        {
          inputId: 'two',
          label: "I'll always take more than one",
          value: 'two',
        },
        {
          inputId: 'three',
          label: "Two's not enough",
          value: 'three',
        },
      ]}
    />
  );
}
