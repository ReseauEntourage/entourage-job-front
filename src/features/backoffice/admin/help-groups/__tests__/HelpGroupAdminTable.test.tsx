import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HelpGroupAdminItem } from '@/src/api/types';
import { openModal } from '@/src/features/modals/Modal';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { HelpGroupAdminList } from '../HelpGroupAdminList';
import { HelpGroupAdminTable } from '../HelpGroupAdminTable';
import { DeleteHelpGroupModal, EditHelpGroupModal } from '../HelpGroupModals';
import {
  formatHelpGroupLastActivity,
  getHelpGroupMainAction,
  getHelpGroupPinAction,
} from '../helpGroupsAdmin.utils';

const mockPush = jest.fn();
const mockUseAdminGroups = jest.fn();
const mockRunAction = jest.fn();
let mockIsDesktop = true;

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    asPath: '/backoffice/admin/groupes',
    push: mockPush,
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  }),
}));
jest.mock('@/src/features/modals/Modal', () => ({
  ...jest.requireActual('@/src/features/modals/Modal'),
  openModal: jest.fn(),
}));
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsDesktop: () => mockIsDesktop,
  useIsMobile: () => !mockIsDesktop,
}));
jest.mock('@/src/use-cases/help-groups', () => ({
  ...jest.requireActual('@/src/use-cases/help-groups'),
  useGetAdminHelpGroupsQuery: (deleted: boolean) => mockUseAdminGroups(deleted),
  useRunHelpGroupActionMutation: () => [mockRunAction, { isLoading: false }],
}));

const buildGroup = (
  props: Partial<HelpGroupAdminItem> = {}
): HelpGroupAdminItem => ({
  id: 'group-1',
  slug: 'refaire-un-cv',
  name: 'Refaire un CV',
  description: 'Description',
  publishedAt: null,
  pinnedAt: null,
  createdAt: '2026-09-01T10:00:00.000Z',
  deletedAt: null,
  membersCount: 0,
  discussionsCount: 0,
  lastActivityAt: null,
  ...props,
});

const published = { publishedAt: '2026-09-02T10:00:00.000Z' };

const renderTable = (groups: HelpGroupAdminItem[], onAction = jest.fn()) => {
  renderWithProviders(
    <HelpGroupAdminTable groups={groups} onAction={onAction} />
  );
  return onAction;
};

const openMenu = (id = 'group-1') =>
  fireEvent.click(screen.getByTestId(`help-group-menu-${id}`));

describe('HelpGroupAdminTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsDesktop = true;
  });

  it('shows an unpublished group with « jamais » as last activity and « Publier » as single main action', () => {
    const onAction = renderTable([buildGroup()]);
    const list = screen.getByTestId('help-group-admin-list');
    expect(list).toHaveTextContent('Refaire un CV');
    expect(list).toHaveTextContent('Non publié');
    expect(list).toHaveTextContent('jamais');
    // No more slug line under the name
    expect(list).not.toHaveTextContent('/groupes/refaire-un-cv');
    expect(screen.queryByTestId('help-group-unpublish-group-1')).toBeNull();
    expect(screen.queryByTestId('help-group-restore-group-1')).toBeNull();

    fireEvent.click(screen.getByTestId('help-group-publish-group-1'));
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'group-1' }),
      'publish'
    );
  });

  it('shows a published group with its counters and « Dépublier » as main action', () => {
    renderTable([
      buildGroup({
        ...published,
        membersCount: 12,
        discussionsCount: 3,
        lastActivityAt: '2026-09-03T10:00:00.000Z',
      }),
    ]);
    const list = screen.getByTestId('help-group-admin-list');
    expect(list).toHaveTextContent('Publié');
    expect(list).toHaveTextContent('12');
    expect(list).toHaveTextContent('3');
    expect(list).not.toHaveTextContent('jamais');
    expect(screen.getByTestId('help-group-unpublish-group-1')).toBeVisible();
    expect(screen.queryByTestId('help-group-publish-group-1')).toBeNull();
  });

  it('keeps the secondary actions in the « ⋯ » menu', () => {
    renderTable([buildGroup(published)]);
    expect(screen.queryByTestId('help-group-preview-group-1')).toBeNull();
    expect(screen.queryByTestId('help-group-edit-group-1')).toBeNull();
    expect(screen.queryByTestId('help-group-delete-group-1')).toBeNull();

    openMenu();
    expect(screen.getByTestId('help-group-preview-group-1')).toHaveTextContent(
      'Prévisualiser'
    );
    expect(screen.getByTestId('help-group-edit-group-1')).toHaveTextContent(
      'Modifier'
    );
    expect(screen.getByTestId('help-group-delete-group-1')).toHaveTextContent(
      'Supprimer le groupe'
    );

    fireEvent.click(screen.getByTestId('help-group-preview-group-1'));
    expect(mockPush).toHaveBeenCalledWith('/backoffice/groupes/refaire-un-cv');

    openMenu();
    fireEvent.click(screen.getByTestId('help-group-edit-group-1'));
    const editModal = (openModal as jest.Mock).mock.calls[0][0];
    expect(editModal.type).toBe(EditHelpGroupModal);
  });

  it('opens the deletion modal from « Supprimer le groupe »', () => {
    renderTable([buildGroup(published)]);
    openMenu();
    fireEvent.click(screen.getByTestId('help-group-delete-group-1'));
    expect(openModal).toHaveBeenCalledTimes(1);
    const modal = (openModal as jest.Mock).mock.calls[0][0];
    expect(modal.type).toBe(DeleteHelpGroupModal);
    expect(modal.props.group).toEqual(
      expect.objectContaining({ id: 'group-1' })
    );
  });

  it('pins then unpins a published group from the « À la une » toggle', () => {
    const onAction = jest.fn();
    const { rerender } = renderWithProviders(
      <HelpGroupAdminTable
        groups={[buildGroup(published)]}
        onAction={onAction}
      />
    );
    const toggle = screen.getByTestId('help-group-pin-toggle-group-1');
    expect(toggle).toBeEnabled();
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAccessibleName('Mettre à la une');
    fireEvent.click(toggle);
    expect(onAction).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'group-1' }),
      'pin'
    );

    rerender(
      <HelpGroupAdminTable
        groups={[
          buildGroup({ ...published, pinnedAt: '2026-09-02T11:00:00.000Z' }),
        ]}
        onAction={onAction}
      />
    );
    const pinned = screen.getByTestId('help-group-pin-toggle-group-1');
    expect(pinned).toHaveAttribute('aria-pressed', 'true');
    expect(pinned).toHaveAccessibleName('Retirer de la une');
    fireEvent.click(pinned);
    expect(onAction).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'group-1' }),
      'unpin'
    );
  });

  it('disables the « À la une » toggle on an unpublished group', () => {
    const onAction = renderTable([buildGroup()]);
    const toggle = screen.getByTestId('help-group-pin-toggle-group-1');
    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAccessibleName(
      'Publiez le groupe pour le mettre à la une'
    );
    fireEvent.click(toggle);
    expect(onAction).not.toHaveBeenCalled();
  });

  it('only offers to restore a deleted group', () => {
    renderTable([buildGroup({ deletedAt: '2026-09-04T10:00:00.000Z' })]);
    expect(screen.getByTestId('help-group-admin-list')).toHaveTextContent(
      'Supprimé'
    );
    expect(screen.getByTestId('help-group-restore-group-1')).toBeVisible();
    expect(screen.queryByTestId('help-group-menu-group-1')).toBeNull();
    expect(screen.getByTestId('help-group-pin-toggle-group-1')).toBeDisabled();
  });

  it('shows each group as a card below the desktop breakpoint', () => {
    mockIsDesktop = false;
    const onAction = renderTable([
      buildGroup({
        ...published,
        membersCount: 12,
        discussionsCount: 3,
      }),
    ]);
    const card = screen.getByTestId('help-group-admin-card-group-1');
    expect(card).toHaveTextContent('Refaire un CV');
    expect(card).toHaveTextContent('Publié');
    expect(card).toHaveTextContent(
      '12 membres · 3 discussions · activité : jamais'
    );
    fireEvent.click(screen.getByTestId('help-group-pin-toggle-group-1'));
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'group-1' }),
      'pin'
    );
    expect(screen.getByTestId('help-group-unpublish-group-1')).toBeVisible();
    openMenu();
    expect(screen.getByTestId('help-group-delete-group-1')).toBeVisible();
  });
});

describe('HelpGroupAdminList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsDesktop = true;
    mockUseAdminGroups.mockImplementation((deleted: boolean) => {
      const groups = deleted
        ? [buildGroup({ id: 'group-9', deletedAt: '2026-09-04T10:00:00Z' })]
        : [buildGroup(published), buildGroup({ id: 'group-2' })];
      return {
        data: groups,
        currentData: groups,
        isLoading: false,
        isError: false,
      };
    });
  });

  it('shows the Groupes / Supprimés tabs with the count of the active tab', () => {
    renderWithProviders(<HelpGroupAdminList />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveTextContent('Groupes2');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(mockUseAdminGroups).toHaveBeenLastCalledWith(false);

    fireEvent.click(tabs[1]);
    expect(mockUseAdminGroups).toHaveBeenLastCalledWith(true);
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getAllByRole('tab')[1]).toHaveTextContent('Supprimés1');
    expect(screen.getByTestId('help-group-restore-group-9')).toBeVisible();
  });

  it('runs the pin action of the toggle', () => {
    mockRunAction.mockResolvedValue({ data: undefined });
    renderWithProviders(<HelpGroupAdminList />);
    fireEvent.click(screen.getByTestId('help-group-pin-toggle-group-1'));
    expect(mockRunAction).toHaveBeenCalledWith({
      id: 'group-1',
      action: 'pin',
    });
  });
});

describe('helpGroupsAdmin.utils', () => {
  it('gives the main action and the pin action of each state', () => {
    expect(getHelpGroupMainAction(buildGroup())).toBe('publish');
    expect(getHelpGroupMainAction(buildGroup(published))).toBe('unpublish');
    expect(getHelpGroupMainAction(buildGroup({ deletedAt: 'z' }))).toBe(
      'restore'
    );
    expect(getHelpGroupPinAction(buildGroup())).toBeNull();
    expect(getHelpGroupPinAction(buildGroup(published))).toBe('pin');
    expect(
      getHelpGroupPinAction(buildGroup({ ...published, pinnedAt: 'y' }))
    ).toBe('unpin');
    expect(
      getHelpGroupPinAction(buildGroup({ ...published, deletedAt: 'z' }))
    ).toBeNull();
  });

  it('reads « jamais » for a group without activity', () => {
    expect(formatHelpGroupLastActivity(null)).toBe('jamais');
  });
});
