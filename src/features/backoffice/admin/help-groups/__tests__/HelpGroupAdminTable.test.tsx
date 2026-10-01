import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HelpGroupAdminItem } from '@/src/api/types';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { HelpGroupAdminTable } from '../HelpGroupAdminTable';
import {
  formatHelpGroupLastActivity,
  getHelpGroupAvailableActions,
} from '../helpGroupsAdmin.utils';

const buildGroup = (
  props: Partial<HelpGroupAdminItem> = {}
): HelpGroupAdminItem => ({
  id: 'group-1',
  slug: 'refaire-un-cv',
  name: 'Refaire un CV',
  description: 'Description',
  charter: 'Cadre',
  publishedAt: null,
  pinnedAt: null,
  createdAt: '2026-09-01T10:00:00.000Z',
  deletedAt: null,
  membersCount: 0,
  discussionsCount: 0,
  lastActivityAt: null,
  ...props,
});

const renderTable = (groups: HelpGroupAdminItem[], onAction = jest.fn()) => {
  renderWithProviders(
    <HelpGroupAdminTable groups={groups} onAction={onAction} />
  );
  return onAction;
};

describe('HelpGroupAdminTable', () => {
  it('shows an unpublished group with « jamais » as last activity and a publish action', () => {
    const onAction = renderTable([buildGroup()]);
    const list = screen.getByTestId('help-group-admin-list');
    expect(list).toHaveTextContent('Refaire un CV');
    expect(list).toHaveTextContent('Non publié');
    expect(list).toHaveTextContent('jamais');
    expect(screen.queryByTestId('help-group-pin-group-1')).toBeNull();
    expect(screen.queryByTestId('help-group-restore-group-1')).toBeNull();
    expect(
      screen.getByTestId('help-group-preview-group-1').closest('a')
    ).toHaveAttribute('href', '/backoffice/groupes/refaire-un-cv');

    fireEvent.click(screen.getByTestId('help-group-publish-group-1'));
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'group-1' }),
      'publish'
    );
  });

  it('shows a published group with its counters and the unpublish and pin actions', () => {
    renderTable([
      buildGroup({
        publishedAt: '2026-09-02T10:00:00.000Z',
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
    expect(screen.getByTestId('help-group-pin-group-1')).toBeVisible();
    expect(screen.queryByTestId('help-group-publish-group-1')).toBeNull();
  });

  it('offers to unpin a pinned group', () => {
    renderTable([
      buildGroup({
        publishedAt: '2026-09-02T10:00:00.000Z',
        pinnedAt: '2026-09-02T11:00:00.000Z',
      }),
    ]);
    expect(screen.getByTestId('help-group-admin-list')).toHaveTextContent(
      'Épinglé'
    );
    expect(screen.getByTestId('help-group-unpin-group-1')).toBeVisible();
    expect(screen.queryByTestId('help-group-pin-group-1')).toBeNull();
  });

  it('only offers to restore a deleted group', () => {
    renderTable([buildGroup({ deletedAt: '2026-09-04T10:00:00.000Z' })]);
    expect(screen.getByTestId('help-group-admin-list')).toHaveTextContent(
      'Supprimé'
    );
    expect(screen.getByTestId('help-group-restore-group-1')).toBeVisible();
    expect(screen.queryByTestId('help-group-preview-group-1')).toBeNull();
    expect(screen.queryByTestId('help-group-edit-group-1')).toBeNull();
    expect(screen.queryByTestId('help-group-delete-group-1')).toBeNull();
  });
});

describe('helpGroupsAdmin.utils', () => {
  it('gives the transitions of each state', () => {
    expect(getHelpGroupAvailableActions(buildGroup())).toEqual(['publish']);
    expect(
      getHelpGroupAvailableActions(buildGroup({ publishedAt: 'x' }))
    ).toEqual(['unpublish', 'pin']);
    expect(
      getHelpGroupAvailableActions(
        buildGroup({ publishedAt: 'x', pinnedAt: 'y' })
      )
    ).toEqual(['unpublish', 'unpin']);
    expect(
      getHelpGroupAvailableActions(buildGroup({ deletedAt: 'z' }))
    ).toEqual(['restore']);
  });

  it('reads « jamais » for a group without activity', () => {
    expect(formatHelpGroupLastActivity(null)).toBe('jamais');
  });
});
