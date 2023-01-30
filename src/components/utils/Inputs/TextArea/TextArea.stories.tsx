import React from 'react';
import TextArea from './TextArea';

export default {
  title: 'Text Area',
  parameters: {
    component: null,
  },
};

export function Default() {
  return (
    <TextArea
      title="A long story to tell"
      name="default"
      id="default"
      onChange={() => {
        console.log('changed');
      }}
    />
  );
}
