'use client';

import React from 'react';
import { SwitchWrapper, HiddenCheckbox, Slider } from './ToggleSwitch.styles';

export interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
  return (
    <SwitchWrapper>
      <HiddenCheckbox checked={checked} onChange={onChange} />
      <Slider checked={checked} />
    </SwitchWrapper>
  );
};
