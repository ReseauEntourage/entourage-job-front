import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { SelectSimple } from '../SelectSimple';

const options = [
  { value: 'paris', label: 'Paris' },
  { value: 'lyon city', label: 'Lyon' },
];

const baseProps = {
  id: 'city',
  name: 'city',
  title: 'Ville',
  value: '' as string,
  options,
  onChange: jest.fn(),
};

describe('SelectSimple', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows the title as a placeholder when nothing is selected', () => {
    render(<SelectSimple {...baseProps} />);
    expect(screen.getByText('Ville')).toBeInTheDocument();
    expect(screen.queryByText('Paris')).not.toBeInTheDocument();
  });

  it('shows the default placeholder with showLabel and no custom one', () => {
    render(<SelectSimple {...baseProps} showLabel showOptional />);
    expect(screen.getByText(/Sélectionnez dans la liste/)).toBeInTheDocument();
    expect(screen.getByText(/Facultatif/)).toBeInTheDocument();
  });

  it('uses the given placeholder', () => {
    render(<SelectSimple {...baseProps} showLabel placeholder="Choisir" />);
    expect(screen.getByText(/Choisir/)).toBeInTheDocument();
  });

  it('opens the list and calls onChange with the chosen value', () => {
    render(<SelectSimple {...baseProps} />);
    fireEvent.click(screen.getByTestId('city'));
    fireEvent.click(screen.getByTestId('select-option-lyoncity'));
    expect(baseProps.onChange).toHaveBeenCalledWith('lyon city');
    expect(screen.queryByTestId('select-option-paris')).not.toBeInTheDocument();
  });

  it('shows the label of the selected value', () => {
    render(<SelectSimple {...baseProps} value="paris" />);
    expect(screen.getByRole('button', { name: 'Paris' })).toBeInTheDocument();
  });

  it('keeps the selected value in a hidden input', () => {
    const { container } = render(<SelectSimple {...baseProps} value="paris" />);
    expect(container.querySelector('input[type="hidden"]')).toHaveValue(
      'paris'
    );
  });

  it('opens the list from the selected value button', () => {
    render(<SelectSimple {...baseProps} value="paris" />);
    fireEvent.click(screen.getByRole('button', { name: 'Paris' }));
    expect(screen.getByTestId('select-option-paris')).toBeInTheDocument();
  });

  it('is disabled, shows errors, and renders nothing when hidden', () => {
    const { rerender, container } = render(
      <SelectSimple
        {...baseProps}
        disabled
        error={{ type: 'required', message: 'Requis' }}
      />
    );
    expect(screen.getByTestId('city')).toBeDisabled();
    expect(screen.getByText('Requis')).toBeInTheDocument();
    rerender(<SelectSimple {...baseProps} hidden />);
    expect(container).toBeEmptyDOMElement();
  });
});
