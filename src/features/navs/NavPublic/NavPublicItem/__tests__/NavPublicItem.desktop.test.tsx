import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';

import { GA_TAGS } from '@/src/constants/tags';
import { NavPublicItemDesktop } from '../NavPublicItem.desktop';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// eslint-disable-next-line import-x/order
import { useRouter } from 'next/router';

const item = {
  href: '/candidat',
  name: 'Devenir candidat(e)',
  tag: GA_TAGS.HEADER_TRAVAILLER_CLIC,
};

describe('NavPublicItemDesktop', () => {
  it('renders the active page as a filled pill', () => {
    (useRouter as jest.Mock).mockReturnValue({
      asPath: '/candidat',
      push: jest.fn(),
    });

    render(<NavPublicItemDesktop item={item} />);

    const link = screen.getByText('Devenir candidat(e)');
    expect(
      getComputedStyle(link.parentElement as Element).backgroundColor
    ).toBe('rgb(71, 168, 185)');
  });

  it('renders an inactive page without the filled pill', () => {
    (useRouter as jest.Mock).mockReturnValue({
      asPath: '/aider',
      push: jest.fn(),
    });

    render(<NavPublicItemDesktop item={item} />);

    const link = screen.getByText('Devenir candidat(e)');
    expect(
      getComputedStyle(link.parentElement as Element).backgroundColor
    ).toBe('rgba(0, 0, 0, 0)');
  });
});
