import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Tooltip } from '../Tooltip';

describe('Tooltip', () => {
  it('shows the content on hover and hides it on leave', () => {
    render(
      <Tooltip content="Explication">
        <span>Survol</span>
      </Tooltip>
    );
    expect(screen.queryByText('Explication')).not.toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByText('Survol'));
    expect(screen.getByText('Explication')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByText('Survol'));
    expect(screen.queryByText('Explication')).not.toBeInTheDocument();
  });

  (['top', 'left', 'right', 'bottom'] as const).forEach((placement) => {
    it(`renders the tooltip with placement ${placement}`, () => {
      render(
        <Tooltip content="Explication" placement={placement} width={100}>
          <span>Survol</span>
        </Tooltip>
      );
      fireEvent.mouseEnter(screen.getByText('Survol'));
      expect(screen.getByText('Explication')).toBeInTheDocument();
    });
  });

  it('becomes keyboard focusable with an ariaLabel and opens on focus', () => {
    render(
      <Tooltip content="Explication" ariaLabel="Aide">
        <span>?</span>
      </Tooltip>
    );
    const trigger = screen.getByRole('img', { name: 'Aide' });
    expect(trigger).toHaveAttribute('tabindex', '0');

    fireEvent.focus(trigger);
    expect(screen.getByText('Explication')).toBeInTheDocument();
    fireEvent.blur(trigger);
    expect(screen.queryByText('Explication')).not.toBeInTheDocument();
  });

  describe('openOnFocus', () => {
    it('opens when a focusable child gets the focus, without adding a role', () => {
      render(
        <Tooltip content="Explication" openOnFocus>
          <button type="button">Action</button>
        </Tooltip>
      );
      expect(screen.queryByRole('img')).not.toBeInTheDocument();

      fireEvent.focus(screen.getByRole('button', { name: 'Action' }));
      expect(screen.getByText('Explication')).toBeInTheDocument();
      fireEvent.blur(screen.getByRole('button', { name: 'Action' }));
      expect(screen.queryByText('Explication')).not.toBeInTheDocument();
    });

    it('does not open on focus by default', () => {
      render(
        <Tooltip content="Explication">
          <button type="button">Action</button>
        </Tooltip>
      );
      fireEvent.focus(screen.getByRole('button', { name: 'Action' }));
      expect(screen.queryByText('Explication')).not.toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('never opens while disabled', () => {
      render(
        <Tooltip content="Explication" disabled>
          <span>Survol</span>
        </Tooltip>
      );
      fireEvent.mouseEnter(screen.getByText('Survol'));
      expect(screen.queryByText('Explication')).not.toBeInTheDocument();
    });

    it('closes an open tooltip when it becomes disabled', () => {
      const { rerender } = render(
        <Tooltip content="Explication">
          <span>Survol</span>
        </Tooltip>
      );
      fireEvent.mouseEnter(screen.getByText('Survol'));
      expect(screen.getByText('Explication')).toBeInTheDocument();

      rerender(
        <Tooltip content="Explication" disabled>
          <span>Survol</span>
        </Tooltip>
      );
      expect(screen.queryByText('Explication')).not.toBeInTheDocument();
    });
  });

  describe('hoverOnly', () => {
    const originalMatchMedia = window.matchMedia;

    const mockHover = (canHover: boolean) => {
      window.matchMedia = jest.fn().mockReturnValue({
        matches: canHover,
      }) as unknown as typeof window.matchMedia;
    };

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('never opens on a device that cannot hover', () => {
      mockHover(false);
      render(
        <Tooltip content="Explication" hoverOnly openOnFocus>
          <button type="button">Action</button>
        </Tooltip>
      );
      const button = screen.getByRole('button', { name: 'Action' });
      fireEvent.mouseEnter(button);
      fireEvent.focus(button);
      expect(screen.queryByText('Explication')).not.toBeInTheDocument();
    });

    it('opens on a device that can hover', () => {
      mockHover(true);
      render(
        <Tooltip content="Explication" hoverOnly>
          <button type="button">Action</button>
        </Tooltip>
      );
      fireEvent.mouseEnter(screen.getByRole('button', { name: 'Action' }));
      expect(screen.getByText('Explication')).toBeInTheDocument();
    });

    it('opens when matchMedia is not available', () => {
      render(
        <Tooltip content="Explication" hoverOnly>
          <button type="button">Action</button>
        </Tooltip>
      );
      fireEvent.mouseEnter(screen.getByRole('button', { name: 'Action' }));
      expect(screen.getByText('Explication')).toBeInTheDocument();
    });
  });

  it('is not focusable without ariaLabel', () => {
    render(
      <Tooltip content="Explication">
        <span>?</span>
      </Tooltip>
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
