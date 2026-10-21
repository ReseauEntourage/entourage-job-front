import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { CopyInput } from '../CopyInput';

describe('CopyInput', () => {
  const writeText = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    writeText.mockReset();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the value in a read-only field and the optional label', () => {
    render(<CopyInput value="https://x.test" label="Lien" />);
    expect(screen.getByDisplayValue('https://x.test')).toHaveAttribute(
      'readonly'
    );
    expect(screen.getByText('Lien')).toBeInTheDocument();
  });

  it('copies the value and shows a confirmation for 2 seconds', () => {
    render(<CopyInput value="https://x.test" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copier le lien' }));
    expect(writeText).toHaveBeenCalledWith('https://x.test');
    expect(screen.getByText('Copié !')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText('Copier')).toBeInTheDocument();
  });
});
