import React from 'react';
import { PhoneInput } from './PhoneInput';

export default {
  title: 'Phone Input',
  parameters: {
    component: null,
  },
};

export function Default() {
  return <PhoneInput title="Numéro de téléphone" />;
}
