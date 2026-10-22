import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import type { Value as E164Number } from 'react-phone-number-input';
import { PhoneInput } from '../PhoneInput';

const baseProps = {
  id: 'phone',
  name: 'phone',
  title: 'Téléphone',
  value: '' as E164Number,
  onChange: jest.fn(),
};

describe('PhoneInput', () => {
  beforeEach(() => jest.clearAllMocks());

  it('uses the title as placeholder when the label is hidden', () => {
    render(<PhoneInput {...baseProps} />);
    expect(screen.getByPlaceholderText('Téléphone')).toBeInTheDocument();
  });

  it('shows the label and falls back to the default placeholder', () => {
    render(<PhoneInput {...baseProps} showLabel />);
    expect(screen.getByText('Téléphone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Écrivez')).toBeInTheDocument();
  });

  it('calls onChange with an international number', () => {
    render(<PhoneInput {...baseProps} />);
    fireEvent.change(screen.getByPlaceholderText('Téléphone'), {
      target: { value: '0612345678' },
    });
    expect(baseProps.onChange).toHaveBeenCalledWith('+33612345678');
  });

  it('shows errors, disabled state and hides on demand', () => {
    const { rerender, container } = render(
      <PhoneInput
        {...baseProps}
        disabled
        error={{ type: 'pattern', message: 'Numéro invalide' }}
      />
    );
    expect(screen.getByText('Numéro invalide')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Téléphone')).toBeDisabled();
    rerender(<PhoneInput {...baseProps} hidden />);
    expect(container).toBeEmptyDOMElement();
  });
});
