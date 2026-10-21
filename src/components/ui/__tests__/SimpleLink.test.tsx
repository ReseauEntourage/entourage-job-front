import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { SimpleLink } from '../SimpleLink';

describe('SimpleLink', () => {
  it('renders an internal link through next/link', () => {
    render(<SimpleLink href="/profil">Profil</SimpleLink>);
    expect(screen.getByRole('link', { name: 'Profil' })).toHaveAttribute(
      'href',
      '/profil'
    );
  });

  it('accepts an object href', () => {
    render(<SimpleLink href={{ pathname: '/search' }}>Recherche</SimpleLink>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/search');
  });

  it('renders a plain anchor for external links', () => {
    render(
      <SimpleLink href="https://example.com" isExternal target="_blank">
        Externe
      </SimpleLink>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });

  it('lets the caller override rel', () => {
    render(
      <SimpleLink
        href="https://example.com"
        isExternal
        target="_blank"
        rel="nofollow"
      >
        Externe
      </SimpleLink>
    );
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'nofollow');
  });

  it('calls onClick', () => {
    const onClick = jest.fn();
    render(
      <SimpleLink href="https://example.com" isExternal onClick={onClick}>
        Externe
      </SimpleLink>
    );
    fireEvent.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders an anchor with the toggle attribute', () => {
    render(<SimpleLink toggle="target: #x">Ouvrir</SimpleLink>);
    expect(screen.getByText('Ouvrir')).toHaveAttribute(
      'data-uk-toggle',
      'target: #x'
    );
  });
});
