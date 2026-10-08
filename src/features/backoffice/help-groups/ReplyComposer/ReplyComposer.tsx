import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, LucidIcon, Text } from '@/src/components/ui';
import { TextArea } from '@/src/components/ui/Inputs';
import { useIsDesktop } from '@/src/hooks/utils';
import {
  selectCurrentUser,
  selectCurrentUserProfile,
} from '@/src/use-cases/current-user';
import {
  getHelpGroupDraftKey,
  HelpGroupsWriteError,
  useCreateHelpGroupReplyMutation,
} from '@/src/use-cases/help-groups';
import { StyledComposerBarButton } from '../DiscussionComposer/DiscussionComposer.styles';
import { HelpGroupAvatar } from '../HelpGroupAvatar';
import {
  COMPOSER_CANCEL_LABEL,
  formatReplyPlaceholder,
  MESSAGE_MAX_LENGTH,
  REPLY_BAR_LABEL,
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
  StyledReplyComposerBar,
  StyledReplyComposerVisibility,
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
 * Reply area at the end of the thread. A failed sending keeps the text and
 * shows an explicit error.
 *
 * Compact (avatar, field, inactive « Répondre ») while it has neither the
 * focus nor a text, same rule as the discussion composer: it opens as soon
 * as the field takes the focus or a draft exists (a restored one included),
 * and losing the focus never closes it. « Annuler » erases the draft and
 * closes it.
 */
export function ReplyComposer({
  slug,
  discussionId,
  authorFirstName,
  charterAccepted,
  onReplied,
  onDiscussionGone,
}: ReplyComposerProps) {
  const isDesktop = useIsDesktop();
  const currentUser = useSelector(selectCurrentUser);
  const hasPicture = useSelector(selectCurrentUserProfile)?.hasPicture ?? false;
  const userId = currentUser?.id;
  const [draft, setDraft, clearDraft] = useDraft<ReplyDraft>(
    userId ? getHelpGroupDraftKey(userId, 'discussion', discussionId) : null,
    EMPTY_DRAFT,
    isDraftEmpty
  );
  const [error, setError] = useState<string | null>(null);
  // Opened by the field, until « Annuler »
  const [isExpanded, setIsExpanded] = useState(false);
  // A draft, restored or being typed, keeps the reply area open
  const isOpen = isExpanded || !isDraftEmpty(draft);
  // Incremented by a gesture opening the area: the field takes the focus.
  // Not on a restored draft.
  const [focusRequest, setFocusRequest] = useState(0);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const [createReply, { isLoading }] = useCreateHelpGroupReplyMutation();

  useLeaveConfirmation(!isDraftEmpty(draft));

  useEffect(() => {
    if (isOpen && focusRequest > 0) {
      contentRef.current?.focus();
    }
  }, [isOpen, focusRequest]);

  const open = () => {
    setIsExpanded(true);
    setFocusRequest((count) => count + 1);
  };

  const close = () => {
    clearDraft();
    setError(null);
    setIsExpanded(false);
  };

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
      setIsExpanded(false);
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

  const placeholder = formatReplyPlaceholder(authorFirstName);

  if (!isOpen) {
    return (
      <StyledReplyComposerBar data-testid="reply-composer">
        {isDesktop && (
          <HelpGroupAvatar
            user={
              currentUser
                ? { id: currentUser.id, firstName: currentUser.firstName }
                : null
            }
            hasPicture={hasPicture}
            size={32}
          />
        )}
        <StyledComposerBarButton
          type="button"
          aria-label={REPLY_BAR_LABEL}
          onFocus={open}
          onClick={open}
          data-testid="reply-composer-bar"
        >
          {placeholder}
        </StyledComposerBarButton>
        {/* Inactive until the area is open: an icon only on mobile */}
        {isDesktop ? (
          <Button variant="primary" disabled dataTestId="reply-composer-send">
            {REPLY_BUTTON_LABEL}
          </Button>
        ) : (
          <Button
            variant="primary"
            rounded="circle"
            disabled
            ariaLabel={REPLY_BUTTON_LABEL}
            dataTestId="reply-composer-send"
          >
            <LucidIcon name="Send" size={18} />
          </Button>
        )}
      </StyledReplyComposerBar>
    );
  }

  return (
    <StyledReplyComposer onSubmit={onSubmit} data-testid="reply-composer">
      <TextArea
        id="reply-composer-content"
        name="reply-composer-content"
        placeholder={placeholder}
        rows={3}
        maxLength={MESSAGE_MAX_LENGTH}
        noMarginBottom
        value={draft.content}
        inputRef={(element) => {
          contentRef.current = element;
        }}
        onChange={(value) => setDraft({ content: value })}
      />
      {error && (
        <Text size="small" color="lightRed">
          {error}
        </Text>
      )}
      <StyledReplyComposerActions>
        <StyledReplyComposerVisibility>
          <LucidIcon name="Eye" size={14} />
          <Text size="small" color="darkGray">
            {REPLY_VISIBILITY_LABEL}
          </Text>
        </StyledReplyComposerVisibility>
        <Button
          // Below the desktop breakpoint the actions share a full-width row:
          // a bordered button keeps « Annuler » readable as a button there
          variant={isDesktop ? 'text' : 'default'}
          onClick={close}
          dataTestId="reply-composer-cancel"
        >
          {COMPOSER_CANCEL_LABEL}
        </Button>
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
