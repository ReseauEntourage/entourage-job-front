import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HelpGroupMember } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { ModalsListener } from '@/src/features/modals/Modal/openModal';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import type { HelpGroupMembersArgs } from '@/src/use-cases/help-groups';
import { HelpGroupMembers } from '../HelpGroupMembers';
import { buildAuthor } from '../__fixtures__/help-groups.fixtures';

const ROLE_LABELS: Record<UserRoles, string> = {
  [UserRoles.CANDIDATE]: 'Candidat',
  [UserRoles.COACH]: 'Coach',
  [UserRoles.REFERER]: 'Prescripteur',
  [UserRoles.ADMIN]: 'Équipe Entourage',
};
const ROLES = [UserRoles.CANDIDATE, UserRoles.COACH, UserRoles.REFERER];
const FIRST_NAMES = ['Amina', 'Julien', 'Sofia', 'Malik', 'Nora', 'Karim'];

const buildMember = (index: number): HelpGroupMember => {
  const role = index === 3 ? UserRoles.ADMIN : ROLES[index % ROLES.length];
  return {
    author: buildAuthor({
      id: `member-${index}`,
      firstName: `${FIRST_NAMES[index % FIRST_NAMES.length]}${index}`,
      lastNameInitial: 'L.',
      roleLabel: ROLE_LABELS[role],
      isAdmin: role === UserRoles.ADMIN,
      // Every fifth profile is not viewable by the reader
      profileLinkable: index % 5 !== 4,
    }),
    hasPicture: false,
    joinedAt: '2026-10-05T10:00:00.000Z',
  };
};

// 61 members, the most recent first, as the back sorts them
const ALL_MEMBERS = Array.from({ length: 61 }, (_, index) =>
  buildMember(index)
);

const roleOf = (member: HelpGroupMember) =>
  (Object.keys(ROLE_LABELS) as UserRoles[]).find(
    (role) => ROLE_LABELS[role] === member.author.roleLabel
  );

// Answers like the back: filters, then the requested page and the total
const mockGetMembers = jest.fn(
  ({ page, limit, search, role }: HelpGroupMembersArgs) => {
    const matching = ALL_MEMBERS.filter(
      (member) =>
        (!search ||
          member.author.firstName
            ?.toLowerCase()
            .includes(search.toLowerCase())) &&
        (!role || roleOf(member) === role)
    );
    const data = {
      members: matching.slice((page - 1) * limit, page * limit),
      total: matching.length,
    };
    return {
      data,
      currentData: data,
      isFetching: false,
      isError: false,
      refetch: jest.fn(),
    };
  }
);

jest.mock('@/src/use-cases/help-groups', () => ({
  ...jest.requireActual('@/src/use-cases/help-groups'),
  useGetHelpGroupMembersQuery: (
    args: HelpGroupMembersArgs,
    options?: { skip?: boolean }
  ) =>
    options?.skip
      ? { isFetching: false, isError: false, refetch: jest.fn() }
      : mockGetMembers(args),
}));

// react-modal scrolls its content on open, which jsdom does not implement
beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

const group = { slug: 'refaire-un-cv', membersCount: 61 };

const renderBlock = (props = group) =>
  renderWithProviders(
    <>
      <HelpGroupMembers group={props} />
      <ModalsListener />
    </>
  );

const openModal = async () => {
  renderBlock();
  fireEvent.click(screen.getByTestId('help-group-members-see-all'));
  return screen.findByTestId('help-group-members-list');
};

const memberRows = () => screen.getAllByTestId('help-group-member');
const lastCallArgs = () => mockGetMembers.mock.calls.at(-1)?.[0];

describe('Help group members', () => {
  beforeEach(() => {
    mockGetMembers.mockClear();
  });

  describe('HelpGroupMembers block', () => {
    it('shows the members count, the 5 most recent members and « Voir les N membres »', () => {
      renderBlock();
      const block = screen.getByTestId('help-group-members');
      expect(
        within(block).getByRole('heading', { name: 'Les membres' })
      ).toBeInTheDocument();
      expect(block).toHaveTextContent('61 membres');
      expect(mockGetMembers).toHaveBeenCalledWith({
        slug: 'refaire-un-cv',
        page: 1,
        limit: 5,
      });
      const items = within(block).getAllByTestId(
        'help-group-members-preview-item'
      );
      expect(items).toHaveLength(5);
      expect(items[0]).toHaveTextContent('Amina0 L.');
      expect(items[0]).toHaveTextContent('Candidat');
      expect(items[3]).toHaveTextContent('Équipe Entourage');
      expect(
        within(items[0]).getByTestId('help-group-avatar')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('help-group-members-see-all')
      ).toHaveTextContent('Voir les 61 membres');
    });

    it('is not shown for a group without members', () => {
      renderBlock({ slug: 'refaire-un-cv', membersCount: 0 });
      expect(
        screen.queryByTestId('help-group-members')
      ).not.toBeInTheDocument();
      expect(mockGetMembers).not.toHaveBeenCalled();
    });
  });

  describe('HelpGroupMembersModal', () => {
    it('opens from « Voir les N membres » with the 20 most recent members and « 20 sur 61 membres »', async () => {
      await openModal();
      expect(screen.getByText('Les membres · 61')).toBeInTheDocument();
      expect(lastCallArgs()).toEqual({
        slug: 'refaire-un-cv',
        page: 1,
        limit: 20,
      });
      expect(memberRows()).toHaveLength(20);
      expect(memberRows()[0]).toHaveTextContent('Amina0 L.');
      expect(memberRows()[0]).toHaveTextContent(
        'Candidat · membre depuis octobre 2026'
      );
      expect(screen.getByText('20 sur 61 membres')).toBeInTheDocument();
    });

    it('adds the next 20 members, until all of them are shown', async () => {
      await openModal();
      fireEvent.click(screen.getByTestId('help-group-members-more'));
      expect(lastCallArgs()).toMatchObject({ page: 2, limit: 20 });
      expect(memberRows()).toHaveLength(40);
      expect(memberRows()[20]).toHaveTextContent('Sofia20 L.');
      expect(screen.getByText('40 sur 61 membres')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('help-group-members-more'));
      fireEvent.click(screen.getByTestId('help-group-members-more'));
      expect(memberRows()).toHaveLength(61);
      expect(screen.getByText('61 sur 61 membres')).toBeInTheDocument();
      expect(
        screen.queryByTestId('help-group-members-more')
      ).not.toBeInTheDocument();
    });

    it('searches on the first name, debounced, from the first page', async () => {
      await openModal();
      fireEvent.click(screen.getByTestId('help-group-members-more'));
      fireEvent.change(screen.getByTestId('help-group-members-search'), {
        target: { value: ' Ami ' },
      });
      // Not on every key stroke
      expect(lastCallArgs()).not.toHaveProperty('search');
      await waitFor(() =>
        expect(lastCallArgs()).toEqual({
          slug: 'refaire-un-cv',
          page: 1,
          limit: 20,
          search: 'Ami',
        })
      );
      expect(memberRows().length).toBeGreaterThan(0);
      memberRows().forEach((row) =>
        expect(row).toHaveTextContent(/Amina\d+ L\./)
      );
    });

    it('filters on the role, from the first page', async () => {
      await openModal();
      const filters = screen.getByRole('radiogroup', {
        name: 'Filtrer par rôle',
      });
      expect(
        within(filters)
          .getAllByRole('radio')
          .map((radio) => radio.textContent)
      ).toEqual([
        'Tous',
        'Candidats',
        'Coachs',
        'Prescripteurs',
        'Équipe Entourage',
      ]);
      expect(
        within(filters).getByRole('radio', { name: 'Tous' })
      ).toBeChecked();
      fireEvent.click(screen.getByTestId('help-group-members-more'));

      fireEvent.click(within(filters).getByRole('radio', { name: 'Coachs' }));
      expect(lastCallArgs()).toEqual({
        slug: 'refaire-un-cv',
        page: 1,
        limit: 20,
        role: UserRoles.COACH,
      });
      expect(
        within(filters).getByRole('radio', { name: 'Coachs' })
      ).toBeChecked();
      memberRows().forEach((row) => expect(row).toHaveTextContent('Coach ·'));

      fireEvent.click(
        within(filters).getByRole('radio', { name: 'Équipe Entourage' })
      );
      expect(lastCallArgs()).toMatchObject({ role: UserRoles.ADMIN });
      expect(memberRows()).toHaveLength(1);
      expect(screen.getByText('1 sur 1 membre')).toBeInTheDocument();
    });

    it('tells when no member matches the search', async () => {
      await openModal();
      fireEvent.change(screen.getByTestId('help-group-members-search'), {
        target: { value: 'Zoé' },
      });
      expect(
        await screen.findByText('Aucun membre ne correspond à votre recherche.')
      ).toBeInTheDocument();
      expect(screen.queryByTestId('help-group-member')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('help-group-members-more')
      ).not.toBeInTheDocument();
    });

    it('links to the profile only when the reader can view it', async () => {
      await openModal();
      const linkable = memberRows()[0];
      expect(
        within(linkable).getByRole('link', { name: 'Voir le profil' })
      ).toHaveAttribute('href', '/backoffice/profile/member-0');
      // Member 4 has a profile the reader cannot view
      const notLinkable = memberRows()[4];
      expect(within(notLinkable).queryByRole('link')).not.toBeInTheDocument();
      expect(notLinkable).not.toHaveTextContent('Voir le profil');
    });
  });
});
