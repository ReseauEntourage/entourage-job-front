import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { Layout } from '../Layout';

let mockPathname = '/cgu';

jest.mock('next/router', () => ({
  withRouter: (Component) => {
    const Wrapped = (props) => (
      <Component {...props} router={{ pathname: mockPathname }} />
    );
    return Wrapped;
  },
}));
jest.mock('next/head', () => ({ __esModule: true, default: () => null }));
jest.mock('next/script', () => ({ __esModule: true, default: () => null }));
jest.mock('@/src/components/ui/Notification', () => ({
  NotificationsContainer: () => null,
}));
jest.mock('@/src/features/navs/NavPublic', () => ({
  NavPublic: () => <nav data-testid="nav-public" />,
}));
jest.mock('@/src/features/navs/NavConnected', () => ({
  NavConnected: () => <nav data-testid="nav-connected" />,
}));
jest.mock('@/src/features/partials/Footer', () => ({ Footer: () => null }));

describe('Layout public nav spacer', () => {
  beforeEach(() => {
    mockPathname = '/cgu';
  });

  it('reserves the nav space by default, under the public nav', () => {
    render(<Layout>content</Layout>);

    expect(screen.getByTestId('nav-public')).toBeInTheDocument();
    expect(screen.getByTestId('public-nav-spacer')).toBeInTheDocument();
  });

  it('reserves no space when the page has a hero', () => {
    render(<Layout hasHero>content</Layout>);

    expect(screen.getByTestId('nav-public')).toBeInTheDocument();
    expect(screen.queryByTestId('public-nav-spacer')).not.toBeInTheDocument();
  });

  it('reserves no space without a header', () => {
    render(<Layout noHeader>content</Layout>);

    expect(screen.queryByTestId('nav-public')).not.toBeInTheDocument();
    expect(screen.queryByTestId('public-nav-spacer')).not.toBeInTheDocument();
  });

  it('reserves no space in the backoffice', () => {
    render(<Layout isBackoffice>content</Layout>);

    expect(screen.getByTestId('nav-connected')).toBeInTheDocument();
    expect(screen.queryByTestId('public-nav-spacer')).not.toBeInTheDocument();
  });

  it('reserves no space on PDF pages', () => {
    mockPathname = '/pdf/cv';
    render(<Layout>content</Layout>);

    expect(screen.queryByTestId('public-nav-spacer')).not.toBeInTheDocument();
  });
});
