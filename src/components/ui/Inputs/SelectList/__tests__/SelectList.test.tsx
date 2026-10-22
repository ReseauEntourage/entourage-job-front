import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { SelectList } from '../SelectList';
import { isGroupedOptions } from '../SelectList.types';
import { SelectListAsync } from '../SelectListAsync';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

const baseProps = {
  id: 'list',
  name: 'list',
  title: 'Liste',
  value: [] as string[],
  options,
  onChange: jest.fn(),
};

describe('SelectList', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders every option and an optional label', () => {
    render(<SelectList {...baseProps} showLabel />);
    expect(screen.getByText('Liste')).toBeInTheDocument();
    expect(screen.getByTestId('list-a')).toHaveTextContent('Option A');
    expect(screen.getByTestId('list-b')).toHaveTextContent('Option B');
  });

  it('adds a value in multi mode', () => {
    render(<SelectList {...baseProps} value={['a']} />);
    fireEvent.click(screen.getByTestId('list-b'));
    expect(baseProps.onChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('removes an already selected value', () => {
    render(<SelectList {...baseProps} value={['a', 'b']} />);
    fireEvent.click(screen.getByTestId('list-a'));
    expect(baseProps.onChange).toHaveBeenCalledWith(['b']);
  });

  it('replaces the value in single mode', () => {
    render(<SelectList {...baseProps} value={['a']} isMulti={false} />);
    fireEvent.click(screen.getByTestId('list-b'));
    expect(baseProps.onChange).toHaveBeenCalledWith(['b']);
  });

  it('renders grouped options with their group label', () => {
    render(
      <SelectList
        {...baseProps}
        options={[
          { label: 'Groupe 1', options: [options[0]] },
          { label: 'Groupe 2', options: [options[1]] },
        ]}
      />
    );
    expect(screen.getByText('Groupe 1')).toBeInTheDocument();
    expect(screen.getByText('Groupe 2')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('list-b'));
    expect(baseProps.onChange).toHaveBeenCalledWith(['b']);
  });

  it('shows errors, and renders nothing when hidden', () => {
    const { container, rerender } = render(
      <SelectList
        {...baseProps}
        isLoading
        estimatedOptionLength={2}
        error={{ type: 'required', message: 'Requis' }}
      />
    );
    expect(screen.getByText('Requis')).toBeInTheDocument();
    rerender(<SelectList {...baseProps} hidden />);
    expect(container).toBeEmptyDOMElement();
  });

  it('detects grouped options', () => {
    expect(isGroupedOptions(options)).toBe(false);
    expect(isGroupedOptions([])).toBe(false);
    expect(isGroupedOptions([{ label: 'g', options }])).toBe(true);
  });
});

describe('SelectListAsync', () => {
  it('loads its options once and renders them', () => {
    const loadOptions = jest.fn((cb) => cb(options));
    render(
      <SelectListAsync
        id="list"
        name="list"
        value={[]}
        onChange={jest.fn()}
        loadOptions={loadOptions}
      />
    );
    expect(loadOptions).toHaveBeenCalledTimes(1);
    expect(loadOptions).toHaveBeenCalledWith(expect.any(Function), '');
    expect(screen.getByTestId('list-a')).toBeInTheDocument();
  });
});
