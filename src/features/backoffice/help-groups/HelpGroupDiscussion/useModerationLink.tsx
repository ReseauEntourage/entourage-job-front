import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { HelpGroupDiscussionView, HelpGroupReplyView } from '@/src/api/types';
import { openModal } from '@/src/features/modals/Modal';
import { ModalConfirm } from '@/src/features/modals/Modal/ModalGeneric/ModalConfirm/ModalConfirm';
import { useRestoreHelpGroupMessageMutation } from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import { ModerationDeleteModal } from '../ModerationModals';
import {
  REPORT_ALREADY_HANDLED_LABEL,
  RESTORE_CONFIRM,
  RESTORE_ERROR_LABEL,
} from '../help-groups-participation.labels';

export type ModerationLinkAction = 'restore' | 'delete';

export const parseModerationLinkAction = (
  value: unknown
): ModerationLinkAction | null =>
  value === 'restore' || value === 'delete' ? value : null;

interface UseModerationLinkParams {
  // From `?moderation=`, set by the buttons of the Slack moderation alerts
  action: ModerationLinkAction | null;
  isAdmin: boolean;
  slug: string;
  discussionId: string;
  replyId: string | null;
  discussion: HelpGroupDiscussionView | undefined;
  replies: HelpGroupReplyView[];
  // The designated message is loaded, or known to be missing
  isTargetResolved: boolean;
  onModerated: (authorId: string | null) => void;
  onDiscussionGone: () => void;
  // The action was opened (or found impossible): drop it from the address
  onConsumed: () => void;
}

/**
 * Opens, once, the moderation action asked by a Slack alert button on the
 * designated message, never running it without a confirmation: restoring
 * asks for a confirmation, deleting opens the moderation deletion with its
 * mandatory motive. A message no longer hidden (already restored), or gone
 * (already deleted), gets a notice instead.
 */
export function useModerationLink({
  action,
  isAdmin,
  slug,
  discussionId,
  replyId,
  discussion,
  replies,
  isTargetResolved,
  onModerated,
  onDiscussionGone,
  onConsumed,
}: UseModerationLinkParams) {
  const dispatch = useDispatch();
  const [restoreMessage] = useRestoreHelpGroupMessageMutation();
  const isDone = useRef(false);

  useEffect(() => {
    if (!action || !isAdmin || !discussion || !isTargetResolved) {
      return;
    }
    if (isDone.current) {
      return;
    }
    isDone.current = true;
    onConsumed();

    const target = replyId
      ? replies.find(({ id }) => id === replyId)
      : discussion;
    // Admins receive the content of a hidden message, with `isUnderReview`
    if (!target || !target.isUnderReview) {
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: REPORT_ALREADY_HANDLED_LABEL,
        })
      );
      return;
    }
    const kind = replyId ? 'replies' : 'discussions';
    if (action === 'restore') {
      openModal(
        <ModalConfirm
          title={RESTORE_CONFIRM.title}
          text={RESTORE_CONFIRM.text}
          buttonText={RESTORE_CONFIRM.button}
          onConfirm={async () => {
            const result = await restoreMessage({ kind, id: target.id });
            if ('error' in result && result.error) {
              dispatch(
                notificationsActions.addNotification({
                  type: 'danger',
                  message: RESTORE_ERROR_LABEL,
                })
              );
            }
          }}
        />
      );
      return;
    }
    const author = 'author' in target ? target.author : null;
    openModal(
      <ModerationDeleteModal
        kind={kind}
        id={target.id}
        slug={slug}
        discussionId={discussionId}
        onDeleted={() => {
          onModerated(author && !author.isDeleted ? author.id : null);
          if (!replyId) {
            onDiscussionGone();
          }
        }}
      />
    );
  }, [
    action,
    isAdmin,
    discussion,
    isTargetResolved,
    replyId,
    replies,
    slug,
    discussionId,
    dispatch,
    restoreMessage,
    onModerated,
    onDiscussionGone,
    onConsumed,
  ]);
}
