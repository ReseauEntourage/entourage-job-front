import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { RadioTypes } from '../Radio.types';
import { RadioAsync } from '../RadioAsync';

const options: RadioTypes[] = [
  { inputId: 'a', label: 'Option A', value: 'a' },
  { inputId: 'b', label: 'Option B', value: 'b' },
];

const baseProps = { id: 'r', name: 'r', value: '', onChange: jest.fn() };

describe('RadioAsync', () => {
  it('shows a loader until the options are loaded, then the radios', () => {
    let callback: (opts: RadioTypes[]) => void = () => {};
    const loadOptions = jest.fn((cb) => {
      callback = cb;
    });
    const { container } = render(
      <RadioAsync {...baseProps} loadOptions={loadOptions} />
    );
    expect(loadOptions).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();

    act(() => callback(options));
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    fireEvent.click(screen.getByLabelText('Option B'));
    expect(baseProps.onChange).toHaveBeenCalledWith('b');
  });

  it('shows the error message when there is no option', () => {
    render(
      <RadioAsync
        {...baseProps}
        errorMessage="Aucune option"
        loadOptions={(cb) => cb([])}
      />
    );
    expect(screen.getByText('Aucune option')).toBeInTheDocument();
  });

  it('renders nothing when hidden', () => {
    const { container } = render(
      <RadioAsync {...baseProps} hidden loadOptions={(cb) => cb(options)} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
