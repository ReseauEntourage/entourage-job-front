import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Text } from '@/src/components/ui';
import { TextArea, TextInput } from '@/src/components/ui/Inputs';
import { selectCurrentUserId } from '@/src/use-cases/current-user';
import {
  getHelpGroupDraftKey,
  HelpGroupsWriteError,
  useCreateHelpGroupDiscussionMutation,
} from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import {
  COMPOSER_CANCEL_LABEL,
  COMPOSER_MESSAGE_LABEL,
  COMPOSER_MESSAGE_REQUIRED,
  COMPOSER_PLACEHOLDER,
  COMPOSER_PUBLISH_LABEL,
  COMPOSER_TITLE_LABEL,
  COMPOSER_TITLE_LOADING_LABEL,
  COMPOSER_TITLE_OWN_LABEL,
  COMPOSER_TITLE_PLACEHOLDER,
  COMPOSER_TITLE_REQUIRED,
  COMPOSER_TITLE_RETRY_LABEL,
  COMPOSER_TITLE_SUGGESTED_LABEL,
  COMPOSER_VISIBILITY_LABEL,
  formatTooLongError,
  MESSAGE_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  WRITE_ERROR_LABELS,
} from '../help-groups-participation.labels';
import { useCharterGatedSend } from '../hooks/useCharterGatedSend';
import { useDraft } from '../hooks/useDraft';
import { useLeaveConfirmation } from '../hooks/useLeaveConfirmation';
import {
  StyledComposer,
  StyledComposerActions,
  StyledComposerBar,
  StyledTitleActions,
  StyledTitleField,
} from './DiscussionComposer.styles';
import {
  TitleOrigin,
  toTitleSource,
  useTitleSuggestion,
} from './useTitleSuggestion';

interface DiscussionDraft {
  content: string;
  title: string;
  titleOrigin: TitleOrigin;
}

const EMPTY_DRAFT: DiscussionDraft = {
  content: '',
  title: '',
  titleOrigin: 'none',
};

const isDraftEmpty = ({ content, title }: DiscussionDraft) =>
  !content.trim() && !title.trim();

const validate = ({ content, title }: DiscussionDraft) => ({
  content: !content.trim()
    ? COMPOSER_MESSAGE_REQUIRED
    : content.trim().length > MESSAGE_MAX_LENGTH
      ? formatTooLongError(MESSAGE_MAX_LENGTH)
      : null,
  title: !title.trim()
    ? COMPOSER_TITLE_REQUIRED
    : title.trim().length > TITLE_MAX_LENGTH
      ? formatTooLongError(TITLE_MAX_LENGTH)
      : null,
});

const toFieldError = (message: string | null) =>
  message ? { type: 'validate', message } : undefined;

interface DiscussionComposerProps {
  slug: string;
  groupId: string;
  charterAccepted: boolean;
  // Incremented by the welcome invite to open the composer
  openSignal?: number;
}

/**
 * Writing a discussion in place, the group staying visible: never a modal
 * (only the charter one, at the very first publication). The message comes
 * first, then the title, which the AI can propose but never imposes.
 */
export function DiscussionComposer({
  slug,
  groupId,
  charterAccepted,
  openSignal = 0,
}: DiscussionComposerProps) {
  const dispatch = useDispatch();
  const userId = useSelector(selectCurrentUserId);
  const [draft, setDraft, clearDraft] = useDraft<DiscussionDraft>(
    userId ? getHelpGroupDraftKey(userId, 'group', groupId) : null,
    EMPTY_DRAFT,
    isDraftEmpty
  );
  // A kept draft reopens the composer with its text
  const [isOpen, setIsOpen] = useState(() => !isDraftEmpty(draft));
  const [hasTriedToPublish, setHasTriedToPublish] = useState(false);
  const [createDiscussion, { isLoading }] =
    useCreateHelpGroupDiscussionMutation();
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);

  const onSuggested = useCallback(
    (title: string) =>
      setDraft((current) => ({ ...current, title, titleOrigin: 'suggested' })),
    [setDraft]
  );
  const suggestion = useTitleSuggestion({
    slug,
    content: draft.content,
    titleOrigin: draft.titleOrigin,
    onSuggested,
  });

  useLeaveConfirmation(isOpen && !isDraftEmpty(draft));

  useEffect(() => {
    if (openSignal > 0) {
      setIsOpen(true);
    }
  }, [openSignal]);

  useEffect(() => {
    if (isOpen && openSignal > 0) {
      messageRef.current?.focus();
    }
  }, [isOpen, openSignal]);

  const close = () => {
    suggestion.reset();
    clearDraft();
    setHasTriedToPublish(false);
    setIsOpen(false);
  };

  const errors = validate(draft);

  const send = useCallback(
    async (acceptCharter: boolean) => {
      const result = await createDiscussion({
        slug,
        dto: {
          title: draft.title.trim(),
          content: draft.content.trim(),
          titleSource: toTitleSource(draft.titleOrigin),
          ...(acceptCharter ? { acceptCharter: true } : {}),
        },
      });
      if ('error' in result && result.error) {
        if (result.error !== HelpGroupsWriteError.CHARTER_NOT_ACCEPTED) {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message:
                result.error === HelpGroupsWriteError.ELEARNING_NOT_COMPLETED
                  ? WRITE_ERROR_LABELS.elearning
                  : result.error === HelpGroupsWriteError.NOT_MEMBER
                    ? WRITE_ERROR_LABELS.notMember
                    : WRITE_ERROR_LABELS.publish,
            })
          );
        }
        return { error: result.error };
      }
      close();
      return {};
    },
    // `close` only touches stable setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createDiscussion, slug, draft, dispatch]
  );
  const publish = useCharterGatedSend(charterAccepted, send);

  const onSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    setHasTriedToPublish(true);
    if (errors.content || errors.title || isLoading) {
      return;
    }
    publish();
  };

  if (!isOpen) {
    return (
      <StyledComposerBar
        type="button"
        onClick={() => setIsOpen(true)}
        data-testid="discussion-composer-bar"
      >
        {COMPOSER_PLACEHOLDER}
      </StyledComposerBar>
    );
  }

  return (
    <StyledComposer onSubmit={onSubmit} data-testid="discussion-composer">
      <Text size="small" color="darkGray">
        {COMPOSER_VISIBILITY_LABEL}
      </Text>
      <TextArea
        id="discussion-composer-message"
        name="discussion-composer-message"
        title={COMPOSER_MESSAGE_LABEL}
        showLabel
        placeholder={COMPOSER_PLACEHOLDER}
        rows={5}
        maxLength={MESSAGE_MAX_LENGTH}
        value={draft.content}
        inputRef={(element) => {
          messageRef.current = element;
        }}
        onChange={(content) => {
          suggestion.cancelPending();
          setDraft((current) => ({ ...current, content }));
        }}
        onBlur={suggestion.onMessageBlur}
        error={hasTriedToPublish ? toFieldError(errors.content) : undefined}
      />
      <StyledTitleField>
        <TextInput
          id="discussion-composer-title"
          name="discussion-composer-title"
          title={COMPOSER_TITLE_LABEL}
          showLabel
          placeholder={
            suggestion.isSuggesting
              ? COMPOSER_TITLE_LOADING_LABEL
              : COMPOSER_TITLE_PLACEHOLDER
          }
          maxLength={TITLE_MAX_LENGTH}
          value={draft.title}
          inputRef={(element) => {
            titleRef.current = element;
          }}
          onChange={(title) => {
            suggestion.cancelPending();
            setDraft((current) => ({
              ...current,
              title,
              titleOrigin:
                current.titleOrigin === 'suggested' ||
                current.titleOrigin === 'edited'
                  ? 'edited'
                  : 'manual',
            }));
          }}
          error={hasTriedToPublish ? toFieldError(errors.title) : undefined}
        />
        <StyledTitleActions>
          {suggestion.isSuggesting && (
            <Text size="small" color="darkGray">
              {COMPOSER_TITLE_LOADING_LABEL}
            </Text>
          )}
          {draft.titleOrigin === 'suggested' && !suggestion.isSuggesting && (
            <Text size="small" color="darkGray">
              {COMPOSER_TITLE_SUGGESTED_LABEL}
            </Text>
          )}
          {suggestion.canRetry && (
            <Button
              variant="text"
              size="small"
              onClick={suggestion.retry}
              dataTestId="discussion-composer-retry-title"
            >
              {COMPOSER_TITLE_RETRY_LABEL}
            </Button>
          )}
          {(draft.titleOrigin === 'suggested' ||
            draft.titleOrigin === 'edited') && (
            <Button
              variant="text"
              size="small"
              dataTestId="discussion-composer-own-title"
              onClick={() => {
                suggestion.cancelPending();
                setDraft((current) => ({
                  ...current,
                  title: '',
                  titleOrigin: 'manual',
                }));
                titleRef.current?.focus();
              }}
            >
              {COMPOSER_TITLE_OWN_LABEL}
            </Button>
          )}
        </StyledTitleActions>
      </StyledTitleField>
      <StyledComposerActions>
        <Button
          variant="default"
          onClick={close}
          dataTestId="discussion-composer-cancel"
        >
          {COMPOSER_CANCEL_LABEL}
        </Button>
        <Button
          variant="primary"
          disabled={isLoading}
          onClick={() => onSubmit()}
          dataTestId="discussion-composer-publish"
        >
          {COMPOSER_PUBLISH_LABEL}
        </Button>
      </StyledComposerActions>
    </StyledComposer>
  );
}
