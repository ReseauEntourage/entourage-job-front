import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { AuthorCard } from '../AuthorCard';
import { HelpGroupAuthor } from '../HelpGroupAuthor';
import { ReactionsSummary } from '../ReactionsSummary';
import {
  buildAuthor,
  deletedAuthor,
} from '../__fixtures__/help-groups.fixtures';

describe('HelpGroupAuthor', () => {
  it('shows the name and role label, linked to the profile', () => {
    renderWithProviders(<HelpGroupAuthor author={buildAuthor()} />);
    expect(screen.getByRole('link', { name: 'Amina L.' })).toHaveAttribute(
      'href',
      '/backoffice/profile/author-1'
    );
    expect(screen.getByText('Coach')).toBeInTheDocument();
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('shows the « Équipe Entourage » label of an admin', () => {
    renderWithProviders(
      <HelpGroupAuthor
        author={buildAuthor({
          roleLabel: 'Équipe Entourage',
          profileLinkable: false,
        })}
      />
    );
    expect(screen.getByText('Équipe Entourage')).toBeInTheDocument();
  });

  it('shows the name without link when the profile is not viewable', () => {
    renderWithProviders(
      <HelpGroupAuthor author={buildAuthor({ profileLinkable: false })} />
    );
    expect(screen.getByText('Amina L.')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('shows « Utilisateur supprimé » without role, initials nor link for a deleted account', () => {
    renderWithProviders(<HelpGroupAuthor author={deletedAuthor} />);
    expect(screen.getByText('Utilisateur supprimé')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText('Coach')).not.toBeInTheDocument();
    expect(screen.getByTestId('help-group-avatar')).toHaveTextContent('');
  });
});

describe('ReactionsSummary', () => {
  it('shows the emojis and the first names, without any number', () => {
    renderWithProviders(
      <ReactionsSummary
        summary={{
          emojis: ['💪', '👏'],
          firstNames: ['Amina', 'Sofia', 'Malik'],
          hasOthers: true,
        }}
      />
    );
    const summary = screen.getByTestId('reactions-summary');
    expect(summary).toHaveTextContent('💪 👏');
    expect(summary).toHaveTextContent(
      "Amina, Sofia, Malik et d'autres soutiennent"
    );
    expect(summary.textContent).not.toMatch(/\d/);
  });

  it('renders nothing without reactions', () => {
    const { container } = renderWithProviders(
      <ReactionsSummary summary={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('AuthorCard', () => {
  it('shows the author with a « Voir son profil » link', () => {
    renderWithProviders(
      <AuthorCard
        author={buildAuthor({
          roleLabel: 'Candidat',
          department: 'Paris (75)',
        })}
      />
    );
    expect(screen.getByText('Amina L.')).toBeInTheDocument();
    expect(screen.getByText('Candidat · Paris (75)')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Voir son profil' })
    ).toHaveAttribute('href', '/backoffice/profile/author-1');
  });

  it('is not rendered for a deleted account', () => {
    const { container } = renderWithProviders(
      <AuthorCard author={deletedAuthor} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('is not rendered when the profile is not viewable', () => {
    const { container } = renderWithProviders(
      <AuthorCard author={buildAuthor({ profileLinkable: false })} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
