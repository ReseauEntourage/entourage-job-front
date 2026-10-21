import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Text } from '../Text';

const mockIsDesktop = jest.fn();
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => mockIsDesktop(),
}));

describe('Text', () => {
  beforeEach(() => {
    mockIsDesktop.mockReturnValue(true);
  });

  it('renders its children', () => {
    render(<Text>Bonjour</Text>);
    expect(screen.getByText('Bonjour')).toBeInTheDocument();
  });

  it('calls onClick', () => {
    const onClick = jest.fn();
    render(<Text onClick={onClick}>Clique</Text>);
    fireEvent.click(screen.getByText('Clique'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('resolves a named size differently on desktop and mobile', () => {
    const { unmount } = render(<Text size="large">Grand</Text>);
    const desktopSize = getComputedStyle(screen.getByText('Grand')).fontSize;
    unmount();

    mockIsDesktop.mockReturnValue(false);
    render(<Text size="large">Grand</Text>);
    const mobileSize = getComputedStyle(screen.getByText('Grand')).fontSize;

    expect(desktopSize).toBeTruthy();
    expect(mobileSize).toBeTruthy();
  });

  it('accepts a numeric size as is', () => {
    render(<Text size={42}>Num</Text>);
    expect(getComputedStyle(screen.getByText('Num')).fontSize).toBe('42px');
  });
});
