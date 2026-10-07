import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
  BadgeVariant,
  Button,
  LucidIcon,
  Text,
} from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { TextArea, TextInput } from '@/src/components/ui/Inputs';
import { StyledInputLabel } from '@/src/components/ui/Inputs/Inputs.styles';
import {
  selectCurrentUser,
  selectCurrentUserProfile,
} from '@/src/use-cases/current-user';
import {
  getHelpGroupDraftKey,
  HelpGroupsWriteError,
  useCreateHelpGroupDiscussionMutation,
} from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import { HelpGroupAvatar } from '../HelpGroupAvatar';
import {
  COMPOSER_BAR_LABEL,
  COMPOSER_CANCEL_LABEL,
  COMPOSER_HEADING,
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
  StyledComposerBarButton,
  StyledComposerHeading,
  StyledComposerVisibility,
  StyledTitleActions,
  StyledTitleField,
  StyledTitleLabelRow,
} from './DiscussionComposer.styles';
import {
  EMPTY_TITLE_SUGGESTION_HISTORY,
  TitleOrigin,
  TitleSuggestionHistory,
  toTitleSource,
  useTitleSuggestion,
} from './useTitleSuggestion';

interface DiscussionDraft {
  content: string;
  title: string;
  titleOrigin: TitleOrigin;
  // Absent from the drafts saved before it existed
  suggestionHistory?: TitleSuggestionHistory;
}

const EMPTY_DRAFT: DiscussionDraft = {
  content: '',
  title: '',
  titleOrigin: 'none',
  suggestionHistory: EMPTY_TITLE_SUGGESTION_HISTORY,
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

const TITLE_INPUT_ID = 'discussion-composer-title';

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
 *
 * Closed, it is a one-line bar with the viewer's avatar. It opens as soon as
 * the bar takes the focus, or while a draft exists (a restored one
 * included), and losing the focus never closes it: only « Annuler » does,
 * which erases the draft.
 */
export function DiscussionComposer({
  slug,
  groupId,
  charterAccepted,
  openSignal = 0,
}: DiscussionComposerProps) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const hasPicture = useSelector(selectCurrentUserProfile)?.hasPicture ?? false;
  const userId = currentUser?.id;
  const [draft, setDraft, clearDraft] = useDraft<DiscussionDraft>(
    userId ? getHelpGroupDraftKey(userId, 'group', groupId) : null,
    EMPTY_DRAFT,
    isDraftEmpty
  );
  // Opened by the bar or the welcome invite, until « Annuler »
  const [isExpanded, setIsExpanded] = useState(false);
  // A draft, restored or being typed, keeps the composer open
  const isOpen = isExpanded || !isDraftEmpty(draft);
  // Incremented by a gesture opening the composer: the message takes the
  // focus, which brings it into view. Not on a restored draft.
  const [focusRequest, setFocusRequest] = useState(0);
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
  const onHistoryChange = useCallback(
    (update: (history: TitleSuggestionHistory) => TitleSuggestionHistory) =>
      setDraft((current) => ({
        ...current,
        suggestionHistory: update(
          current.suggestionHistory ?? EMPTY_TITLE_SUGGESTION_HISTORY
        ),
      })),
    [setDraft]
  );
  const suggestion = useTitleSuggestion({
    slug,
    content: draft.content,
    titleOrigin: draft.titleOrigin,
    history: draft.suggestionHistory ?? EMPTY_TITLE_SUGGESTION_HISTORY,
    onHistoryChange,
    onSuggested,
  });

  useLeaveConfirmation(isOpen && !isDraftEmpty(draft));

  const open = () => {
    setIsExpanded(true);
    setFocusRequest((count) => count + 1);
  };

  useEffect(() => {
    if (openSignal > 0) {
      setIsExpanded(true);
      setFocusRequest((count) => count + 1);
    }
  }, [openSignal]);

  useEffect(() => {
    if (isOpen && focusRequest > 0) {
      messageRef.current?.focus();
    }
  }, [isOpen, focusRequest]);

  const close = () => {
    suggestion.reset();
    clearDraft();
    setHasTriedToPublish(false);
    setIsExpanded(false);
  };

  const avatar = (size: number) => (
    <HelpGroupAvatar
      user={
        currentUser
          ? { id: currentUser.id, firstName: currentUser.firstName }
          : null
      }
      hasPicture={hasPicture}
      size={size}
    />
  );

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
      <StyledComposerBar aria-label={COMPOSER_HEADING}>
        {avatar(40)}
        <StyledComposerBarButton
          type="button"
          aria-label={COMPOSER_BAR_LABEL}
          onFocus={open}
          onClick={open}
          data-testid="discussion-composer-bar"
        >
          {COMPOSER_PLACEHOLDER}
        </StyledComposerBarButton>
      </StyledComposerBar>
    );
  }

  return (
    <StyledComposer
      onSubmit={onSubmit}
      aria-label={COMPOSER_HEADING}
      data-testid="discussion-composer"
    >
      <StyledComposerHeading>
        {avatar(36)}
        <H5 title={COMPOSER_HEADING} weight="semibold" noMarginBottom />
      </StyledComposerHeading>
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
        <StyledTitleLabelRow>
          <StyledInputLabel htmlFor={TITLE_INPUT_ID}>
            {COMPOSER_TITLE_LABEL}
          </StyledInputLabel>
          {draft.titleOrigin === 'suggested' && !suggestion.isSuggesting && (
            <Badge
              variant={BadgeVariant.ExtraLightTeal}
              size="small"
              dataTestId="discussion-composer-suggested-title"
            >
              <LucidIcon name="Sparkles" size={14} />
              {COMPOSER_TITLE_SUGGESTED_LABEL}
            </Badge>
          )}
        </StyledTitleLabelRow>
        <TextInput
          id={TITLE_INPUT_ID}
          name={TITLE_INPUT_ID}
          title={COMPOSER_TITLE_LABEL}
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
          {suggestion.canRetry && (
            <Button
              variant="text"
              size="small"
              weight="semibold"
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
              weight="semibold"
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
        <StyledComposerVisibility>
          <LucidIcon name="Eye" size={14} />
          <Text size="small" color="darkGray">
            {COMPOSER_VISIBILITY_LABEL}
          </Text>
        </StyledComposerVisibility>
        <Button
          variant="text"
          onClick={close}
          dataTestId="discussion-composer-cancel"
        >
          {COMPOSER_CANCEL_LABEL}
        </Button>
        <Button
          variant="primary"
          size="large"
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
