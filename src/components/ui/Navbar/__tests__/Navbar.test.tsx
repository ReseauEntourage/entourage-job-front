import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Navbar } from '../Navbar';
import { NavbarLogo } from '../NavbarLogo';

describe('Navbar', () => {
  it('renders its left, center and right areas', () => {
    render(
      <Navbar
        id="nav"
        left="L"
        center="C"
        right="R"
        sticky
        style={{ top: 0 }}
      />
    );
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
    expect(document.getElementById('nav')).toBeInTheDocument();
  });
});

describe('NavbarLogo', () => {
  it('links the primary logo to its target', () => {
    render(<NavbarLogo href="/home" type="primary" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/home');
    expect(
      screen.getByLabelText('EntourageProLogoPrimary Icon')
    ).toBeInTheDocument();
  });

  it('renders the secondary logo', () => {
    render(<NavbarLogo href="/home" type="secondary" width={10} height={5} />);
    expect(
      screen.getByLabelText('EntourageProLogoSecondary Icon')
    ).toHaveAttribute('width', '10');
  });
});
