import React from 'react';
import TextInput from './TextInput';

export default {
  title: 'Text Input',
  parameters: {
    component: null,
  },
};

export function Default() {
  return <TextInput title="A short story to tell" />;
}

export function Password() {
  return <TextInput type="password" title="A secret story to tell" />;
}

export function Email() {
  return <TextInput type="email" title="Share your email" />;
}
