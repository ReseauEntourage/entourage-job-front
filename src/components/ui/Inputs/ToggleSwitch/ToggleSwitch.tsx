'use client';

import React from 'react';
import { SwitchWrapper, HiddenCheckbox, Slider } from './ToggleSwitch.styles';

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  // Accessible name, when no visible label is associated
  ariaLabel?: string;
  disabled?: boolean;
}

export const ToggleSwitch = ({
  checked = false,
  onChange,
  ariaLabel,
  disabled = false,
}: ToggleSwitchProps) => {
  return (
    <SwitchWrapper>
      <HiddenCheckbox
        role="switch"
        aria-label={ariaLabel}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <Slider checked={checked} $disabled={disabled} />
    </SwitchWrapper>
  );
};
