import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { Breadcrumb } from '../Breadcrumb';

describe('Breadcrumb', () => {
  it('renders a group page breadcrumb: "Groupes > Nom du groupe"', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Groupes', href: '/backoffice/groupes' },
          { label: 'Refaire un CV', href: '/backoffice/groupes/refaire-un-cv' },
        ]}
      />
    );

    expect(screen.getByRole('link', { name: 'Groupes' })).toHaveAttribute(
      'href',
      '/backoffice/groupes'
    );
    // The last level is the current page, never a link
    expect(
      screen.queryByRole('link', { name: 'Refaire un CV' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Refaire un CV')).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('renders a discussion breadcrumb with the full title kept for truncation', () => {
    const longTitle =
      'Comment présenter une longue période sans emploi dans son CV sans se dévaloriser ?';
    render(
      <Breadcrumb
        items={[
          { label: 'Groupes', href: '/backoffice/groupes' },
          { label: 'Refaire un CV', href: '/backoffice/groupes/refaire-un-cv' },
          { label: longTitle },
        ]}
      />
    );

    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Refaire un CV' })).toHaveAttribute(
      'href',
      '/backoffice/groupes/refaire-un-cv'
    );
    // Truncated by CSS only: the whole title is still rendered
    expect(screen.getByText(longTitle)).toBeInTheDocument();
    expect(screen.getByTitle(longTitle)).toBeInTheDocument();
    expect(screen.getAllByText('>')).toHaveLength(2);
  });
});
