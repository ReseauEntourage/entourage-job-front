import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Spinner } from '../Spinner';

describe('Spinner', () => {
  it('draws a 30px circle in the dash variant by default', () => {
    render(<Spinner variant="dash" />);
    const svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveAttribute('width', '30');
    expect(svg).toHaveAttribute('height', '30');
    expect(svg?.querySelector('circle')).toHaveAttribute('r', '14');
  });

  it('shrinks the dash variant to the given size', () => {
    render(<Spinner variant="dash" size={15} />);
    expect(screen.getByRole('status').querySelector('svg')).toHaveAttribute(
      'width',
      '15'
    );
  });

  it('accepts a size given as a string', () => {
    render(<Spinner variant="dash" size="20" />);
    expect(screen.getByRole('status').querySelector('svg')).toHaveAttribute(
      'width',
      '20'
    );
  });

  it('keeps the ring as the default variant', () => {
    render(<Spinner />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
