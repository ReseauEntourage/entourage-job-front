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

  it('is not focusable without ariaLabel', () => {
    render(
      <Tooltip content="Explication">
        <span>?</span>
      </Tooltip>
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
