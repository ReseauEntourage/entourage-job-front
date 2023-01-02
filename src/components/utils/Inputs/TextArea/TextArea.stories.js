import React from 'react';
import TextInput from './TextArea';

export default {
  title: 'Text Area',
  parameters: {
    component: null,
  },
};

export function Default() {
  return <TextInput label="A long story to tell" />;
}
