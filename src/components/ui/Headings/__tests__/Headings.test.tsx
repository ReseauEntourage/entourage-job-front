import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { H1 } from '../H1';
import { H2 } from '../H2';
import { H3 } from '../H3';
import { H4 } from '../H4';
import { H5 } from '../H5';
import { H6 } from '../H6';

jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
  useIsMobile: () => false,
}));

describe('Headings', () => {
  (
    [
      [1, H1],
      [2, H2],
      [3, H3],
      [4, H4],
      [5, H5],
      [6, H6],
    ] as const
  ).forEach(([level, Heading]) => {
    it(`H${level} renders its title as a heading of the same level`, () => {
      render(<Heading title="Mon titre" />);
      expect(
        screen.getByRole('heading', { level, name: 'Mon titre' })
      ).toBeInTheDocument();
    });
  });

  it('accepts options without crashing', () => {
    render(<H1 title="Centre" center noMarginBottom compact weight="normal" />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
