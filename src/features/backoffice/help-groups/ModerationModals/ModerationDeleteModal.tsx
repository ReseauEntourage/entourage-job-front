import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HelpGroupDeletionReason } from '@/src/api/types';
import { Button, Text } from '@/src/components/ui';
import { Radio, TextArea } from '@/src/components/ui/Inputs';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { ModalFooter } from '@/src/features/modals/Modal/ModalGeneric/ModalFooter/ModalFooter';
import { useDeleteHelpGroupMessageAsAdminMutation } from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import {
  COMPOSER_CANCEL_LABEL,
  MODERATION_MODAL,
  MODERATION_REASON_LABELS,
  WRITE_ERROR_LABELS,
} from '../help-groups-participation.labels';
import { StyledModerationModalContent } from './ModerationModals.styles';

const COMMENT_MAX_LENGTH = 500;

interface ModerationDeleteModalProps {
  kind: 'discussions' | 'replies';
  id: string;
  slug: string;
  discussionId: string;
  onDeleted: () => void;
}

/**
 * Deletion of someone else's message by an Entourage admin: the motive is
 * mandatory, the precision optional, both visible to the team only. The
 * author is not notified.
 */
export function ModerationDeleteModal({
  kind,
  id,
  slug,
  discussionId,
  onDeleted,
}: ModerationDeleteModalProps) {
  const { onClose } = useModalContext();
  const dispatch = useDispatch();
  const [reason, setReason] = useState<HelpGroupDeletionReason | ''>('');
  const [comment, setComment] = useState('');
  const [deleteMessage, { isLoading }] =
    useDeleteHelpGroupMessageAsAdminMutation();

  const confirm = async () => {
    if (!reason || isLoading) {
      return;
    }
    const result = await deleteMessage({
      kind,
      id,
      slug,
      discussionId,
      dto: { reason, ...(comment.trim() ? { comment: comment.trim() } : {}) },
    });
    if ('error' in result && result.error) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: WRITE_ERROR_LABELS.delete,
        })
      );
      return;
    }
    onClose?.();
    onDeleted();
  };

  return (
    <ModalGeneric title={MODERATION_MODAL.title} align="left">
      <StyledModerationModalContent>
        <Text>{MODERATION_MODAL.text}</Text>
        <Radio
          id="moderation-reason"
          name="moderation-reason"
          title={MODERATION_MODAL.reasonLabel}
          value={reason}
          onChange={(value) => setReason(value as HelpGroupDeletionReason)}
          options={Object.entries(MODERATION_REASON_LABELS).map(
            ([value, label]) => ({
              inputId: `moderation-reason-${value}`,
              value,
              label,
            })
          )}
        />
        <TextArea
          id="moderation-comment"
          name="moderation-comment"
          title={MODERATION_MODAL.commentLabel}
          showLabel
          rows={3}
          maxLength={COMMENT_MAX_LENGTH}
          value={comment}
          onChange={setComment}
        />
      </StyledModerationModalContent>
      <ModalFooter>
        <Button
          variant="default"
          onClick={onClose}
          dataTestId="moderation-cancel"
        >
          {COMPOSER_CANCEL_LABEL}
        </Button>
        <Button
          variant="primary"
          disabled={!reason || isLoading}
          onClick={confirm}
          dataTestId="moderation-confirm"
        >
          {MODERATION_MODAL.confirm}
        </Button>
      </ModalFooter>
    </ModalGeneric>
  );
}
