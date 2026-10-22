import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { BottomSheet } from '../BottomSheet';

describe('BottomSheet', () => {
  beforeEach(() => {
    global.ResizeObserver = class {
      observe = jest.fn();
      disconnect = jest.fn();
      unobserve = jest.fn();
    } as unknown as typeof ResizeObserver;
  });

  const renderSheet = () => {
    const children = (mode: 'compact' | 'full') => <p>mode:{mode}</p>;
    return render(<BottomSheet>{children}</BottomSheet>);
  };

  it('starts in compact mode', () => {
    renderSheet();
    expect(screen.getByText('mode:compact')).toBeInTheDocument();
  });

  it('toggles between compact and full when the pill is clicked', () => {
    const { container } = renderSheet();
    const pill = container.firstElementChild?.firstElementChild as HTMLElement;
    fireEvent.click(pill);
    expect(screen.getByText('mode:full')).toBeInTheDocument();
    fireEvent.click(pill);
    expect(screen.getByText('mode:compact')).toBeInTheDocument();
  });

  it('expands after a long swipe up', () => {
    const { container } = renderSheet();
    const sheet = container.firstElementChild as HTMLElement;
    fireEvent.touchStart(sheet, { touches: [{ clientY: 300 }] });
    fireEvent.touchMove(sheet, { touches: [{ clientY: 200 }] });
    fireEvent.touchEnd(sheet);
    expect(screen.getByText('mode:full')).toBeInTheDocument();
  });

  it('stays compact after a short swipe', () => {
    const { container } = renderSheet();
    const sheet = container.firstElementChild as HTMLElement;
    fireEvent.touchStart(sheet, { touches: [{ clientY: 300 }] });
    fireEvent.touchMove(sheet, { touches: [{ clientY: 280 }] });
    fireEvent.touchEnd(sheet);
    expect(screen.getByText('mode:compact')).toBeInTheDocument();
  });

  it('collapses after a long swipe down when expanded', () => {
    const { container } = renderSheet();
    const sheet = container.firstElementChild as HTMLElement;
    fireEvent.click(sheet.firstElementChild as HTMLElement);
    fireEvent.touchStart(sheet, { touches: [{ clientY: 100 }] });
    fireEvent.touchMove(sheet, { touches: [{ clientY: 200 }] });
    fireEvent.touchEnd(sheet);
    expect(screen.getByText('mode:compact')).toBeInTheDocument();
  });

  it('keeps the content scrollable when swiping up while expanded', () => {
    const { container } = renderSheet();
    const sheet = container.firstElementChild as HTMLElement;
    fireEvent.click(sheet.firstElementChild as HTMLElement);
    fireEvent.touchStart(sheet, { touches: [{ clientY: 200 }] });
    fireEvent.touchMove(sheet, { touches: [{ clientY: 100 }] });
    fireEvent.touchEnd(sheet);
    expect(screen.getByText('mode:full')).toBeInTheDocument();
  });

  it('publishes the collapsed height as a CSS variable and cleans it up', () => {
    const { unmount } = renderSheet();
    expect(
      document.documentElement.style.getPropertyValue(
        '--wizard-bottom-sheet-collapsed-height'
      )
    ).not.toBe('');
    unmount();
    expect(
      document.documentElement.style.getPropertyValue(
        '--wizard-bottom-sheet-collapsed-height'
      )
    ).toBe('');
  });
});
