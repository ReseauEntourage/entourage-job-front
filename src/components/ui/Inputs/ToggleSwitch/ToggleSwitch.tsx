'use client';

import React from 'react';
import { SwitchWrapper, HiddenCheckbox, Slider } from './ToggleSwitch.styles';

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  // Accessible name, when no visible label is associated
  ariaLabel?: string;
}

export const ToggleSwitch = ({
  checked = false,
  onChange,
  ariaLabel,
}: ToggleSwitchProps) => {
  return (
    <SwitchWrapper>
      <HiddenCheckbox
        role="switch"
        aria-label={ariaLabel}
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <Slider checked={checked} />
    </SwitchWrapper>
  );
};
