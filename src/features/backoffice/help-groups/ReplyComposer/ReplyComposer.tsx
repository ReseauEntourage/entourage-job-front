import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Text } from '@/src/components/ui';
import { TextArea } from '@/src/components/ui/Inputs';
import { selectCurrentUser } from '@/src/use-cases/current-user';
import {
  getHelpGroupDraftKey,
  HelpGroupsWriteError,
  useCreateHelpGroupReplyMutation,
} from '@/src/use-cases/help-groups';
import {
  formatReplyPlaceholder,
  MESSAGE_MAX_LENGTH,
  REPLY_BUTTON_LABEL,
  REPLY_VISIBILITY_LABEL,
  WRITE_ERROR_LABELS,
} from '../help-groups-participation.labels';
import { useCharterGatedSend } from '../hooks/useCharterGatedSend';
import { useDraft } from '../hooks/useDraft';
import { useLeaveConfirmation } from '../hooks/useLeaveConfirmation';
import {
  StyledReplyComposer,
  StyledReplyComposerActions,
} from './ReplyComposer.styles';

interface ReplyDraft {
  content: string;
}

const EMPTY_DRAFT: ReplyDraft = { content: '' };
const isDraftEmpty = ({ content }: ReplyDraft) => !content.trim();

const toErrorLabel = (error: unknown) => {
  if (error === HelpGroupsWriteError.DISCUSSION_NOT_FOUND) {
    return WRITE_ERROR_LABELS.discussionGone;
  }
  if (error === HelpGroupsWriteError.ELEARNING_NOT_COMPLETED) {
    return WRITE_ERROR_LABELS.elearning;
  }
  if (error === HelpGroupsWriteError.NOT_MEMBER) {
    return WRITE_ERROR_LABELS.notMember;
  }
  return WRITE_ERROR_LABELS.reply;
};

interface ReplyComposerProps {
  slug: string;
  discussionId: string;
  authorFirstName: string | null;
  charterAccepted: boolean;
  onReplied: (replyId: string) => void;
  onDiscussionGone: () => void;
}

/**
 * Reply area stuck at the bottom of the discussion panel. A failed sending
 * keeps the text and shows an explicit error.
 */
export function ReplyComposer({
  slug,
  discussionId,
  authorFirstName,
  charterAccepted,
  onReplied,
  onDiscussionGone,
}: ReplyComposerProps) {
  const userId = useSelector(selectCurrentUser)?.id;
  const [draft, setDraft, clearDraft] = useDraft<ReplyDraft>(
    userId ? getHelpGroupDraftKey(userId, 'discussion', discussionId) : null,
    EMPTY_DRAFT,
    isDraftEmpty
  );
  const [error, setError] = useState<string | null>(null);
  const [createReply, { isLoading }] = useCreateHelpGroupReplyMutation();

  useLeaveConfirmation(!isDraftEmpty(draft));

  const content = draft.content.trim();
  const isValid = !!content && content.length <= MESSAGE_MAX_LENGTH;

  const send = useCallback(
    async (acceptCharter: boolean) => {
      const result = await createReply({
        slug,
        discussionId,
        dto: { content, ...(acceptCharter ? { acceptCharter: true } : {}) },
      });
      if ('error' in result && result.error) {
        if (result.error !== HelpGroupsWriteError.CHARTER_NOT_ACCEPTED) {
          setError(toErrorLabel(result.error));
        }
        if (result.error === HelpGroupsWriteError.DISCUSSION_NOT_FOUND) {
          onDiscussionGone();
        }
        return { error: result.error };
      }
      setError(null);
      clearDraft();
      if (result.data) {
        onReplied(result.data.id);
      }
      return {};
    },
    [
      createReply,
      slug,
      discussionId,
      content,
      clearDraft,
      onReplied,
      onDiscussionGone,
    ]
  );
  const reply = useCharterGatedSend(charterAccepted, send);

  const onSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!isValid || isLoading) {
      return;
    }
    reply();
  };

  return (
    <StyledReplyComposer onSubmit={onSubmit} data-testid="reply-composer">
      <TextArea
        id="reply-composer-content"
        name="reply-composer-content"
        placeholder={formatReplyPlaceholder(authorFirstName)}
        rows={3}
        maxLength={MESSAGE_MAX_LENGTH}
        value={draft.content}
        onChange={(value) => setDraft({ content: value })}
      />
      {error && (
        <Text size="small" color="lightRed">
          {error}
        </Text>
      )}
      <StyledReplyComposerActions>
        <Text size="small" color="darkGray">
          {REPLY_VISIBILITY_LABEL}
        </Text>
        <Button
          variant="primary"
          disabled={!isValid || isLoading}
          onClick={() => onSubmit()}
          dataTestId="reply-composer-send"
        >
          {REPLY_BUTTON_LABEL}
        </Button>
      </StyledReplyComposerActions>
    </StyledReplyComposer>
  );
}
