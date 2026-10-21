import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { TextArea } from '../TextArea';

// ESM-only dependency, see the comment in src/hooks/useContactEligibility.spec.tsx
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1024,
}));

const baseProps = {
  id: 'bio',
  name: 'bio',
  title: 'Biographie',
  value: '',
  onChange: jest.fn(),
};

describe('TextArea', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses the title as placeholder when the label is hidden', () => {
    render(<TextArea {...baseProps} />);
    expect(screen.getByPlaceholderText('Biographie')).toBeInTheDocument();
  });

  it('shows the label and the explicit placeholder with showLabel', () => {
    render(<TextArea {...baseProps} showLabel placeholder="Parlez de vous" />);
    expect(screen.getByText('Biographie')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Parlez de vous')).toBeInTheDocument();
  });

  it('falls back to a default placeholder', () => {
    render(<TextArea {...baseProps} title={undefined} />);
    expect(screen.getByPlaceholderText('Écrivez')).toBeInTheDocument();
  });

  it('calls onChange with the typed text', () => {
    render(<TextArea {...baseProps} />);
    fireEvent.change(screen.getByTestId('bio'), { target: { value: 'Salut' } });
    expect(baseProps.onChange).toHaveBeenCalledWith('Salut');
  });

  it('forwards blur and keydown events', () => {
    const onBlur = jest.fn();
    const onKeyDown = jest.fn();
    render(<TextArea {...baseProps} onBlur={onBlur} onKeyDown={onKeyDown} />);
    fireEvent.keyDown(screen.getByTestId('bio'), { key: 'a' });
    fireEvent.blur(screen.getByTestId('bio'));
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('is disabled when asked and renders nothing when hidden', () => {
    const { rerender, container } = render(
      <TextArea {...baseProps} disabled />
    );
    expect(screen.getByTestId('bio')).toBeDisabled();
    rerender(<TextArea {...baseProps} hidden />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the field error', () => {
    render(
      <TextArea
        {...baseProps}
        error={{ type: 'required', message: 'Requis' }}
      />
    );
    expect(screen.getByText('Requis')).toBeInTheDocument();
  });

  it('shows the remaining characters, then the overflow', () => {
    const { rerender } = render(
      <TextArea {...baseProps} value="abc" maxLength={10} />
    );
    expect(screen.getByText('7 caractère(s) restant(s)')).toBeInTheDocument();
    rerender(<TextArea {...baseProps} value="abcdefghijkl" maxLength={10} />);
    expect(screen.getByText(/Limite dépassée de 2/)).toBeInTheDocument();
  });

  it('shows the missing characters when below minLength', () => {
    render(<TextArea {...baseProps} value="ab" minLength={5} />);
    expect(
      screen.getByText('Encore 3 caractère(s) nécessaire(s)')
    ).toBeInTheDocument();
  });

  it('shows no counter without limits', () => {
    render(<TextArea {...baseProps} value="ab" />);
    expect(screen.queryByText(/restant/)).not.toBeInTheDocument();
  });

  it('shows the lines counter with maxLines and reports whether the max is reached', () => {
    const setIsMaxLinesReached = jest.fn();
    render(
      <TextArea
        {...baseProps}
        value="ab"
        maxLines={{ lines: 3, width: 300 }}
        setIsMaxLinesReached={setIsMaxLinesReached}
      />
    );
    // jsdom has no layout, so only the presence of the lines counter is checked
    expect(screen.getByText(/ligne\(s\)/)).toBeInTheDocument();
    expect(setIsMaxLinesReached).toHaveBeenCalledWith(false);
  });

  it('passes the ref callback the textarea element', () => {
    const inputRef = jest.fn();
    render(<TextArea {...baseProps} inputRef={inputRef} />);
    expect(inputRef).toHaveBeenCalledWith(screen.getByTestId('bio'));
  });
});
