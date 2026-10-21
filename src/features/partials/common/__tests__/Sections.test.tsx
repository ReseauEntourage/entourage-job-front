import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { CtaSection } from '../CtaSection/CtaSection';
import { InviteToRegisterSection } from '../InviteToRegisterSection/InviteToRegisterSection';

jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

describe('CtaSection', () => {
  const baseProps = {
    title: 'Rejoignez-nous',
    description: 'Une belle aventure',
    ctaLabel: 'Go',
    dataTestId: 'cta',
    onClick: jest.fn(),
  };

  it('shows the title, description and a working button', () => {
    render(<CtaSection {...baseProps} />);
    expect(
      screen.getByRole('heading', { name: 'Rejoignez-nous' })
    ).toBeInTheDocument();
    expect(screen.getByText('Une belle aventure')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('cta'));
    expect(baseProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('omits an empty description and links when href is given', () => {
    render(<CtaSection {...baseProps} description="" href="/inscription" />);
    expect(screen.queryByText('Une belle aventure')).not.toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/inscription');
  });
});

describe('InviteToRegisterSection', () => {
  it('invites coaches to register', () => {
    const onClick = jest.fn();
    render(<InviteToRegisterSection as="Coach" onClick={onClick} />);
    expect(screen.getByRole('heading')).toHaveTextContent(
      /communauté de coachs bénévoles/
    );
    fireEvent.click(screen.getByTestId('button-register'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Je deviens coach')).toBeInTheDocument();
  });
});
