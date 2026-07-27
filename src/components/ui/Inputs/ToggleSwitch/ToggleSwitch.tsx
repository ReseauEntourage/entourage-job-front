'use client';

import React from 'react';
import { SwitchWrapper, HiddenCheckbox, Slider } from './ToggleSwitch.styles';

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const ToggleSwitch = ({
  checked = false,
  onChange,
}: ToggleSwitchProps) => {
  return (
    <SwitchWrapper>
      <HiddenCheckbox
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <Slider checked={checked} />
    </SwitchWrapper>
  );
};
