import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { SvgIcon } from '../SvgIcon';

describe('SvgIcon', () => {
  it('renders the icon with an accessible label built from its name', () => {
    render(<SvgIcon name="Check" />);
    expect(screen.getByLabelText('Check Icon')).toBeInTheDocument();
  });

  it('uses width as height by default and applies class', () => {
    render(<SvgIcon name="Check" width={20} className="x" />);
    const icon = screen.getByLabelText('Check Icon');
    expect(icon).toHaveAttribute('width', '20');
    expect(icon).toHaveAttribute('height', '20');
    expect(icon).toHaveClass('x');
  });

  it('keeps an explicit height', () => {
    render(<SvgIcon name="Check" width={20} height={10} />);
    expect(screen.getByLabelText('Check Icon')).toHaveAttribute('height', '10');
  });
});
