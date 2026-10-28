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

const type = (value: string) =>
  fireEvent.change(screen.getByTestId('start'), { target: { value } });

describe('DatePicker', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows the label and the expected format when empty', () => {
    render(<DatePicker {...baseProps} />);
    expect(screen.getByText('Début')).toBeInTheDocument();
    expect(screen.getByTestId('start')).toHaveAttribute(
      'placeholder',
      'jj/mm/aaaa'
    );
  });

  it('hides the label when showLabel is false', () => {
    render(<DatePicker {...baseProps} showLabel={false} />);
    expect(screen.queryByText('Début')).not.toBeInTheDocument();
  });

  it('adds the separators and sends the ISO date once complete', () => {
    render(<DatePicker {...baseProps} />);
    type('14031987');
    expect(screen.getByTestId('start')).toHaveValue('14/03/1987');
    expect(baseProps.onChange).toHaveBeenLastCalledWith('1987-03-14');
  });

  it('shows what is left to type behind a partial date', () => {
    render(<DatePicker {...baseProps} />);
    expect(screen.queryByTestId('start-ghost')).not.toBeInTheDocument();
    type('19');
    expect(screen.getByTestId('start-ghost')).toHaveTextContent('19/--/----');
    type('19031987');
    expect(screen.queryByTestId('start-ghost')).not.toBeInTheDocument();
  });

  it('sends the typed text while the date is incomplete', () => {
    render(<DatePicker {...baseProps} />);
    type('1403');
    expect(screen.getByTestId('start')).toHaveValue('14/03');
    expect(baseProps.onChange).toHaveBeenLastCalledWith('14/03');
  });

  it('sends the typed text for an impossible date', () => {
    render(<DatePicker {...baseProps} />);
    type('31021990');
    expect(screen.getByTestId('start')).toHaveValue('31/02/1990');
    expect(baseProps.onChange).toHaveBeenLastCalledWith('31/02/1990');
  });

  it('removes the separator with its digit on a backspace', () => {
    render(<DatePicker {...baseProps} />);
    type('14/03');
    type('14/0');
    type('14/');
    expect(screen.getByTestId('start')).toHaveValue('14');
  });

  it('keeps a pasted dd/mm/yyyy date as it is', () => {
    render(<DatePicker {...baseProps} />);
    type('14/03/1987');
    expect(screen.getByTestId('start')).toHaveValue('14/03/1987');
    expect(baseProps.onChange).toHaveBeenLastCalledWith('1987-03-14');
  });

  it('sends an empty value when the field is cleared', () => {
    render(<DatePicker {...baseProps} />);
    type('14');
    type('');
    expect(baseProps.onChange).toHaveBeenLastCalledWith('');
  });

  it('prefills a stored ISO date as dd/mm/yyyy', () => {
    render(<DatePicker {...baseProps} value="2024-05-01" />);
    expect(screen.getByTestId('start')).toHaveValue('01/05/2024');
  });

  it('follows a value reset from the outside', () => {
    const { rerender } = render(
      <DatePicker {...baseProps} value="2024-05-01" />
    );
    rerender(<DatePicker {...baseProps} value="" />);
    expect(screen.getByTestId('start')).toHaveValue('');
  });

  it('fills the field with the day picked in the native calendar', () => {
    render(<DatePicker {...baseProps} />);
    fireEvent.change(screen.getByTestId('start-calendar'), {
      target: { value: '2024-05-01' },
    });
    expect(screen.getByTestId('start')).toHaveValue('01/05/2024');
    expect(baseProps.onChange).toHaveBeenLastCalledWith('2024-05-01');
  });

  it('opens the native calendar only from the calendar button', () => {
    const showPicker = jest.fn();
    render(<DatePicker {...baseProps} />);
    const calendar = screen.getByTestId('start-calendar') as HTMLInputElement;
    calendar.showPicker = showPicker;

    fireEvent.click(screen.getByTestId('start'));
    expect(showPicker).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('start-calendar-button'));
    expect(showPicker).toHaveBeenCalledTimes(1);

    // The invisible date input over the button gets the pointer events
    fireEvent.click(calendar);
    expect(showPicker).toHaveBeenCalledTimes(2);
  });

  it('does not fail where showPicker is missing or refused', () => {
    render(<DatePicker {...baseProps} />);
    const calendar = screen.getByTestId('start-calendar') as HTMLInputElement;
    calendar.showPicker = () => {
      throw new Error('NotAllowedError');
    };
    expect(() => fireEvent.click(calendar)).not.toThrow();
  });

  it('gives the native calendar its bounds, with a default minimum', () => {
    render(<DatePicker {...baseProps} max="2030-01-01" />);
    const calendar = screen.getByTestId('start-calendar');
    expect(calendar).toHaveAttribute('min', '1900-01-01');
    expect(calendar).toHaveAttribute('max', '2030-01-01');
  });

  it('displays the error and the disabled state', () => {
    render(
      <DatePicker
        {...baseProps}
        value="2024-05-01"
        disabled
        error={{ type: 'required', message: 'Date invalide' }}
      />
    );
    expect(screen.getByTestId('start')).toBeDisabled();
    expect(screen.getByText('Date invalide')).toBeInTheDocument();
  });

  it('renders nothing when hidden', () => {
    const { container } = render(<DatePicker {...baseProps} hidden />);
    expect(container).toBeEmptyDOMElement();
  });
});
