import React from 'react';
import TextInput from './TextInput';

export default {
  title: 'Text Input',
  parameters: {
    component: null,
  },
};

export function Default() {
  return <TextInput label="A short story to tell" />;
}

export function Password() {
  return <TextInput password label="A secret story to tell" />;
}
