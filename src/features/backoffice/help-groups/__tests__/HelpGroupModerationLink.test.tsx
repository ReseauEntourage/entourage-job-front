import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HelpGroupDiscussionView, HelpGroupReplyView } from '@/src/api/types';
import { ModalsListener } from '@/src/features/modals/Modal/openModal';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import {
  ModerationLinkAction,
  parseModerationLinkAction,
  useModerationLink,
} from '../HelpGroupDiscussion';
import {
  buildDiscussion,
  buildReply,
} from '../__fixtures__/help-groups.fixtures';

const mockRestore = jest.fn();

jest.mock('@/src/use-cases/help-groups', () => ({
  ...jest.requireActual('@/src/use-cases/help-groups'),
  useRestoreHelpGroupMessageMutation: () => [mockRestore, { isLoading: false }],
  useDeleteHelpGroupMessageAsAdminMutation: () => [
    jest.fn(),
    { isLoading: false },
  ],
}));

// react-modal scrolls its content on open, which jsdom does not implement
beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

interface HarnessProps {
  action: ModerationLinkAction | null;
  isAdmin?: boolean;
  replyId?: string | null;
  discussion?: HelpGroupDiscussionView;
  replies?: HelpGroupReplyView[];
  isTargetResolved?: boolean;
  onConsumed?: () => void;
}

const Harness = ({
  action,
  isAdmin = true,
  replyId = null,
  discussion = buildDiscussion({ isUnderReview: true }),
  replies = [],
  isTargetResolved = true,
  onConsumed = jest.fn(),
}: HarnessProps) => {
  useModerationLink({
    action,
    isAdmin,
    slug: 'refaire-un-cv',
    discussionId: discussion.id,
    replyId,
    discussion,
    replies,
    isTargetResolved,
    onModerated: jest.fn(),
    onDiscussionGone: jest.fn(),
    onConsumed,
  });
  return null;
};

const renderHarness = (props: HarnessProps) =>
  renderWithProviders(
    <>
      <Harness {...props} />
      <ModalsListener />
    </>
  );

const notifications = (store: { getState: () => unknown }) =>
  (
    store.getState() as {
      notifications: { notifications: { message: string }[] };
    }
  ).notifications.notifications.map(({ message }) => message);

describe('Moderation link from Slack', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRestore.mockResolvedValue({ data: undefined });
  });

  it('only accepts the restore and delete actions', () => {
    expect(parseModerationLinkAction('restore')).toBe('restore');
    expect(parseModerationLinkAction('delete')).toBe('delete');
    expect(parseModerationLinkAction('resolve')).toBeNull();
    expect(parseModerationLinkAction(['restore'])).toBeNull();
  });

  it('asks a confirmation before restoring a hidden reply, then restores it', async () => {
    const onConsumed = jest.fn();
    renderHarness({
      action: 'restore',
      replyId: 'reply-7',
      replies: [buildReply({ id: 'reply-7', isUnderReview: true })],
      onConsumed,
    });
    expect(
      await screen.findByText('Rétablir ce message ?')
    ).toBeInTheDocument();
    expect(onConsumed).toHaveBeenCalledTimes(1);
    expect(mockRestore).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('modal-confirm-confirm'));
    await waitFor(() =>
      expect(mockRestore).toHaveBeenCalledWith({
        kind: 'replies',
        id: 'reply-7',
      })
    );
  });

  it('opens the moderation deletion of a hidden discussion, motive to choose', async () => {
    renderHarness({ action: 'delete' });
    expect(await screen.findByTestId('moderation-confirm')).toBeInTheDocument();
    expect(mockRestore).not.toHaveBeenCalled();
  });

  it('waits for the designated reply before opening anything', () => {
    const onConsumed = jest.fn();
    renderHarness({
      action: 'restore',
      replyId: 'reply-7',
      isTargetResolved: false,
      onConsumed,
    });
    expect(onConsumed).not.toHaveBeenCalled();
    expect(screen.queryByText('Rétablir ce message ?')).not.toBeInTheDocument();
  });

  it('tells that the report was already handled for a message no longer hidden', () => {
    const { store } = renderHarness({
      action: 'restore',
      discussion: buildDiscussion({ isUnderReview: false }),
    });
    expect(notifications(store)).toContain('Ce signalement a déjà été traité.');
    expect(screen.queryByText('Rétablir ce message ?')).not.toBeInTheDocument();
  });

  it('tells that the report was already handled for a deleted reply', () => {
    const { store } = renderHarness({
      action: 'delete',
      replyId: 'reply-gone',
      replies: [],
    });
    expect(notifications(store)).toContain('Ce signalement a déjà été traité.');
    expect(screen.queryByTestId('moderation-confirm')).not.toBeInTheDocument();
  });

  it('opens nothing for a non admin', () => {
    const onConsumed = jest.fn();
    renderHarness({ action: 'delete', isAdmin: false, onConsumed });
    expect(onConsumed).not.toHaveBeenCalled();
    expect(screen.queryByTestId('moderation-confirm')).not.toBeInTheDocument();
  });
});
