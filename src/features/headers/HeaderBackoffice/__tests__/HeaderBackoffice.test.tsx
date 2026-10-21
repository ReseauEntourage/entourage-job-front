import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HeaderBackoffice } from '../HeaderBackoffice';

jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

describe('HeaderBackoffice', () => {
  it('renders the title as a heading, with description and children', () => {
    render(
      <HeaderBackoffice title="Annuaire" description="Trouvez des profils">
        <span>Contenu</span>
      </HeaderBackoffice>
    );
    expect(
      screen.getByRole('heading', { name: 'Annuaire' })
    ).toBeInTheDocument();
    expect(screen.getByText('Trouvez des profils')).toBeInTheDocument();
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });

  it('shows no call to action by default', () => {
    render(<HeaderBackoffice title="Annuaire" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows a call to action that triggers its handler', () => {
    const onClick = jest.fn();
    render(
      <HeaderBackoffice title="Annuaire" cta={{ label: 'Créer', onClick }} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('draws a separator unless told otherwise', () => {
    const { container, rerender } = render(<HeaderBackoffice title="A" />);
    expect(container.querySelector('.simple-separator')).toBeInTheDocument();
    rerender(<HeaderBackoffice title="A" noSeparator />);
    expect(
      container.querySelector('.simple-separator')
    ).not.toBeInTheDocument();
  });
});
