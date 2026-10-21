import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ToggleSwitch } from '../ToggleSwitch';

describe('ToggleSwitch', () => {
  it('exposes a switch role with its accessible name and state', () => {
    render(<ToggleSwitch ariaLabel="Notifications" checked />);
    const toggle = screen.getByRole('switch', { name: 'Notifications' });
    expect(toggle).toBeChecked();
  });

  it('is off by default', () => {
    render(<ToggleSwitch ariaLabel="Notifications" />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('calls onChange with the new state', () => {
    const onChange = jest.fn();
    render(<ToggleSwitch ariaLabel="Notifications" onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('is disabled when asked', () => {
    render(<ToggleSwitch ariaLabel="Notifications" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });
});
