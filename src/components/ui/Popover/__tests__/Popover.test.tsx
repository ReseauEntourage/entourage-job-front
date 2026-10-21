import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Popover } from '../Popover';

describe('Popover', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('opens on hover and closes shortly after leaving', () => {
    render(
      <Popover content="Détails">
        <span>Survol</span>
      </Popover>
    );
    expect(screen.queryByText('Détails')).not.toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByText('Survol'));
    expect(screen.getByText('Détails')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByText('Survol'));
    expect(screen.getByText('Détails')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(screen.queryByText('Détails')).not.toBeInTheDocument();
  });

  it('stays open when the pointer moves onto the content', () => {
    render(
      <Popover content="Détails">
        <span>Survol</span>
      </Popover>
    );
    fireEvent.mouseEnter(screen.getByText('Survol'));
    fireEvent.mouseLeave(screen.getByText('Survol'));
    fireEvent.mouseEnter(screen.getByText('Détails'));
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Détails')).toBeInTheDocument();
  });

  it('closes when the content is clicked', () => {
    render(
      <Popover content="Détails" placement="top" align="left">
        <span>Survol</span>
      </Popover>
    );
    fireEvent.mouseEnter(screen.getByText('Survol'));
    fireEvent.click(screen.getByText('Détails'));
    expect(screen.queryByText('Détails')).not.toBeInTheDocument();
  });
});
