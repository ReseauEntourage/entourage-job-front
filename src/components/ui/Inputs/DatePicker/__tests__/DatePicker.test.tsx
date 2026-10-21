import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { DatePicker } from '../DatePicker';

const baseProps = {
  id: 'start',
  name: 'start',
  title: 'Début',
  value: '',
  onChange: jest.fn(),
};

describe('DatePicker', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows the label and a default minimum date', () => {
    render(<DatePicker {...baseProps} max="2030-01-01" />);
    expect(screen.getByText('Début')).toBeInTheDocument();
    const input = screen.getByTestId('start');
    expect(input).toHaveAttribute('min', '1900-01-01');
    expect(input).toHaveAttribute('max', '2030-01-01');
  });

  it('hides the label when showLabel is false', () => {
    render(<DatePicker {...baseProps} showLabel={false} />);
    expect(screen.queryByText('Début')).not.toBeInTheDocument();
  });

  it('calls onChange with the typed date', () => {
    render(<DatePicker {...baseProps} />);
    fireEvent.change(screen.getByTestId('start'), {
      target: { value: '2024-05-01' },
    });
    expect(baseProps.onChange).toHaveBeenCalledWith('2024-05-01');
  });

  it('displays the value, errors and disabled state', () => {
    render(
      <DatePicker
        {...baseProps}
        value="2024-05-01"
        min="2000-01-01"
        disabled
        error={{ type: 'required', message: 'Date invalide' }}
      />
    );
    expect(screen.getByTestId('start')).toHaveValue('2024-05-01');
    expect(screen.getByTestId('start')).toHaveAttribute('min', '2000-01-01');
    expect(screen.getByTestId('start')).toBeDisabled();
    expect(screen.getByText('Date invalide')).toBeInTheDocument();
  });

  it('renders nothing when hidden', () => {
    const { container } = render(<DatePicker {...baseProps} hidden />);
    expect(container).toBeEmptyDOMElement();
  });
});
