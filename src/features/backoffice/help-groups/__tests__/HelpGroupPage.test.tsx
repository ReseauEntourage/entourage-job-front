import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { DiscussionRow } from '../DiscussionRow';
import { DiscussionList, HelpGroupHeader } from '../HelpGroupPage';
import { HelpGroupCharter } from '../HelpGroupPage/HelpGroupCharter';
import {
  buildAuthor,
  buildDiscussionItem,
} from '../__fixtures__/help-groups.fixtures';

const groupPage = {
  id: 'group-1',
  slug: 'refaire-un-cv',
  name: 'Refaire un CV',
  description: 'Première ligne\nDeuxième ligne',
  membersCount: 128,
  isMember: false,
  emailsEnabled: null,
  isPublished: true,
  viewerPermissions: {
    state: 'mustJoin' as const,
    charterAccepted: false,
    showWelcomeInvite: false,
  },
};

describe('Help group page', () => {
  describe('DiscussionRow', () => {
    it('shows the replies count and the reactions of a discussion with replies', () => {
      renderWithProviders(
        <DiscussionRow
          groupSlug="refaire-un-cv"
          discussion={buildDiscussionItem({
            repliesCount: 4,
            reactionsSummary: {
              emojis: ['💪'],
              firstNames: ['Amina', 'Sofia'],
              hasOthers: false,
            },
          })}
        />
      );
      const row = screen.getByTestId('discussion-row');
      expect(row).toHaveTextContent('Comment présenter un trou dans mon CV ?');
      expect(row).toHaveTextContent('Amina L.');
      expect(row).toHaveTextContent('Dernière activité le 2 septembre 2026');
      expect(row).toHaveTextContent('Amina et Sofia soutiennent');
      expect(row).toHaveTextContent('4 réponses');
      expect(
        screen.getByRole('link', {
          name: 'Comment présenter un trou dans mon CV ?',
        })
      ).toHaveAttribute(
        'href',
        '/backoffice/groupes/refaire-un-cv/discussions/discussion-1'
      );
    });

    it('shows « 1 réponse » for a single reply', () => {
      renderWithProviders(
        <DiscussionRow
          groupSlug="refaire-un-cv"
          discussion={buildDiscussionItem({ repliesCount: 1 })}
        />
      );
      expect(screen.getByTestId('discussion-row')).toHaveTextContent(
        '1 réponse'
      );
    });

    it('shows no replies count nor reactions for a discussion without any', () => {
      renderWithProviders(
        <DiscussionRow
          groupSlug="refaire-un-cv"
          discussion={buildDiscussionItem({
            author: buildAuthor({ profileLinkable: false }),
          })}
        />
      );
      const row = screen.getByTestId('discussion-row');
      expect(row).not.toHaveTextContent(/réponse/);
      expect(screen.queryByTestId('reactions-summary')).not.toBeInTheDocument();
    });
  });

  describe('DiscussionList', () => {
    it('shows a neutral opening message without discussion', () => {
      renderWithProviders(
        <DiscussionList groupSlug="refaire-un-cv" discussions={[]} />
      );
      expect(screen.getByText("Ce groupe vient d'ouvrir")).toBeInTheDocument();
      expect(document.body.textContent).not.toMatch(
        /0 discussion|aucune activité/i
      );
    });
  });

  describe('HelpGroupHeader', () => {
    it('shows the name, the members count and the full description', () => {
      renderWithProviders(<HelpGroupHeader group={groupPage} />);
      expect(screen.getByText('Refaire un CV')).toBeInTheDocument();
      expect(screen.getByText('128 membres')).toBeInTheDocument();
      expect(
        screen.getByText(/Première ligne\s+Deuxième ligne/)
      ).toBeInTheDocument();
      expect(screen.queryByText('Non publié')).not.toBeInTheDocument();
    });

    it('never shows zero members', () => {
      renderWithProviders(
        <HelpGroupHeader group={{ ...groupPage, membersCount: 0 }} />
      );
      expect(document.body.textContent).not.toMatch(/0 membre/);
    });

    it('flags an unpublished group in an admin preview', () => {
      renderWithProviders(
        <HelpGroupHeader group={{ ...groupPage, isPublished: false }} />
      );
      expect(screen.getByText('Non publié')).toBeInTheDocument();
    });
  });

  describe('HelpGroupCharter', () => {
    it('shows the frame common to every group, in full', () => {
      renderWithProviders(<HelpGroupCharter />);
      const charter = screen.getByTestId('help-group-charter');
      expect(charter).toHaveTextContent('Le cadre');
      expect(charter).toHaveTextContent(
        'Ces règles valent pour tous les groupes.'
      );
      expect(charter).toHaveTextContent(
        'Ce qui se dit dans un groupe reste dans le groupe.'
      );
      expect(charter.querySelectorAll('li')).toHaveLength(4);
      // Not the platform ethics charter, and nothing to expand
      expect(screen.queryByText('Lire le cadre en entier')).toBeNull();
    });
  });
});
