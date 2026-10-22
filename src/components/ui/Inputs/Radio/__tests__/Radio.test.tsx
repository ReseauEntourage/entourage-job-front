import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Radio } from '../Radio';

const options = [
  { inputId: 'opt-a', label: 'Option A', value: 'a', filterData: 'x' },
  { inputId: 'opt-b', label: 'Option B', value: 'b', filterData: 'y' },
  { inputId: '', label: 'Option C', value: 'c d' },
];

const baseProps = {
  id: 'choice',
  name: 'choice',
  value: '',
  onChange: jest.fn(),
  options,
};

describe('Radio', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the title, subtitle and all options', () => {
    render(<Radio {...baseProps} title="Choix" subtitle="Un seul" />);
    expect(screen.getByText('Choix')).toBeInTheDocument();
    expect(screen.getByText('Un seul')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('builds an id from the value when inputId is missing', () => {
    render(<Radio {...baseProps} />);
    expect(screen.getByTestId('radio-cd')).toBeInTheDocument();
  });

  it('checks the option matching a string value or an array value', () => {
    const { rerender } = render(<Radio {...baseProps} value="b" />);
    expect(screen.getByLabelText('Option B')).toBeChecked();
    rerender(<Radio {...baseProps} value={['a'] as unknown as string} />);
    expect(screen.getByLabelText('Option A')).toBeChecked();
  });

  it('calls onChange with the selected value and checks it', () => {
    render(<Radio {...baseProps} />);
    fireEvent.click(screen.getByLabelText('Option B'));
    expect(baseProps.onChange).toHaveBeenCalledWith('b');
    expect(screen.getByLabelText('Option B')).toBeChecked();
  });

  it('filters options by filterData and honours limit', () => {
    const { rerender } = render(<Radio {...baseProps} filter="x" />);
    expect(screen.queryByLabelText('Option B')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Option A')).toBeInTheDocument();
    rerender(<Radio {...baseProps} limit={1} />);
    expect(screen.getAllByRole('radio')).toHaveLength(1);
  });

  it('disables listed options and shows their message', () => {
    render(
      <Radio
        {...baseProps}
        optionsToDisable={[
          { option: 'a', message: 'Indisponible' },
          { option: 'b', message: <em>Complet</em> },
        ]}
      />
    );
    expect(screen.getByLabelText('Option A')).toBeDisabled();
    expect(screen.getByText('Indisponible')).toBeInTheDocument();
    expect(screen.getByText('Complet')).toBeInTheDocument();
    expect(screen.getByLabelText('Option C')).not.toBeDisabled();
  });

  it('shows an error and renders nothing when hidden', () => {
    const { rerender, container } = render(
      <Radio {...baseProps} error={{ type: 'required', message: 'Requis' }} />
    );
    expect(screen.getByText('Requis')).toBeInTheDocument();
    rerender(<Radio {...baseProps} hidden />);
    expect(container).toBeEmptyDOMElement();
  });
});
