import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  HelpGroupAuthor as HelpGroupAuthorType,
  HelpGroupReactionEmoji,
  HelpGroupReactionsSummary,
  HelpGroupReportReason,
} from '@/src/api/types';
import { Button, SimpleLink, Text } from '@/src/components/ui';
import { H1 } from '@/src/components/ui/Headings';
import { TextArea, TextInput } from '@/src/components/ui/Inputs';
import { REPORT_REASONS } from '@/src/constants/reports';
import { openModal } from '@/src/features/modals/Modal';
import { ModalConfirm } from '@/src/features/modals/Modal/ModalGeneric/ModalConfirm/ModalConfirm';
import {
  useDeleteHelpGroupDiscussionMutation,
  useDeleteHelpGroupReplyMutation,
  useRestoreHelpGroupMessageMutation,
  useSetHelpGroupReactionMutation,
  useUpdateHelpGroupDiscussionMutation,
  useUpdateHelpGroupReplyMutation,
} from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import { HelpGroupAuthor } from '../HelpGroupAuthor';
import { HelpGroupContent } from '../HelpGroupContent';
import {
  getMessageMenuActions,
  MessageMenu,
  MessageMenuAction,
} from '../MessageMenu';
import { ModerationDeleteModal, RevisionsModal } from '../ModerationModals';
import { ReactionPicker } from '../ReactionPicker';
import { ReactionsSummary } from '../ReactionsSummary';
import { HelpGroupReportModal } from '../ReportModal';
import {
  COMPOSER_CANCEL_LABEL,
  DELETE_DISCUSSION_CONFIRM,
  DELETE_REPLY_CONFIRM,
  EDIT_SAVE_LABEL,
  EDITED_MENTION,
  formatReportReasons,
  HIDDEN_BY_REPORTS_BANNER,
  LINK_COPIED_LABEL,
  MESSAGE_MAX_LENGTH,
  MODERATION_DELETE_SHORT_LABEL,
  RESTORE_ERROR_LABEL,
  RESTORE_LABEL,
  TITLE_MAX_LENGTH,
  UNDER_REVIEW_MENTION,
  WRITE_ERROR_LABELS,
} from '../help-groups-participation.labels';
import { getProfileHref } from '../help-groups.labels';
import {
  StyledAuthorDetails,
  StyledHiddenByReportsActions,
  StyledHiddenByReportsBanner,
  StyledHiddenByReportsText,
  StyledMessageEditor,
  StyledMessageEditorActions,
  StyledMessageFooter,
  StyledMessageHeader,
  StyledMessageMeta,
  StyledUnderReviewMention,
} from './HelpGroupMessage.styles';

export interface HelpGroupMessageData {
  id: string;
  title?: string | null;
  content: string;
  author: HelpGroupAuthorType;
  createdAt: string;
  editedAt: string | null;
  reactionsSummary: HelpGroupReactionsSummary | null;
  viewerReaction: HelpGroupReactionEmoji | null;
  // Hidden after reports: only its author and the admins receive it
  isUnderReview?: boolean;
  // Admins only, on a message under review
  reportReasons?: HelpGroupReportReason[];
}

const REPORT_REASON_LABELS = Object.fromEntries(
  REPORT_REASONS.map(({ value, label }) => [value, label])
) as Record<HelpGroupReportReason, string>;

export interface HelpGroupViewer {
  id: string | null;
  firstName: string;
  isAdmin: boolean;
}

interface HelpGroupMessageProps {
  kind: 'discussion' | 'reply';
  message: HelpGroupMessageData;
  slug: string;
  discussionId: string;
  viewer: HelpGroupViewer;
  // Member allowed to write: the reaction action is shown
  canReact: boolean;
  // False in an admin preview of an unpublished group: no write action at
  // all, only « Copier le lien du message »
  canManage?: boolean;
  // Below the desktop breakpoint, the author card is not rendered: the
  // header of the original message gives the location and the profile link
  showAuthorDetails?: boolean;
  // The author deleted their discussion
  onDiscussionDeleted?: () => void;
  // An admin deleted the message: shortcut to write to its author
  onModerated?: (authorId: string | null) => void;
}

export const getMessageUrl = (
  slug: string,
  discussionId: string,
  replyId?: string
) =>
  `${window.location.origin}/backoffice/groupes/${encodeURIComponent(
    slug
  )}/discussions/${encodeURIComponent(discussionId)}${
    replyId ? `?replyId=${encodeURIComponent(replyId)}` : ''
  }`;

/**
 * The original message of a discussion, or one of its replies, with the
 * actions of the viewer: react, copy the link, edit or delete their own
 * message, and for an admin, the previous versions and the moderation.
 */
export function HelpGroupMessage({
  kind,
  message,
  slug,
  discussionId,
  viewer,
  canReact,
  canManage = true,
  showAuthorDetails = false,
  onDiscussionDeleted,
  onModerated,
}: HelpGroupMessageProps) {
  const dispatch = useDispatch();
  const isDiscussion = kind === 'discussion';
  const isAuthor = !!viewer.id && message.author.id === viewer.id;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(message.title ?? '');
  const [editedContent, setEditedContent] = useState(message.content);

  const [setReaction, { isLoading: isReacting }] =
    useSetHelpGroupReactionMutation();
  const [updateDiscussion, { isLoading: isUpdatingDiscussion }] =
    useUpdateHelpGroupDiscussionMutation();
  const [updateReply, { isLoading: isUpdatingReply }] =
    useUpdateHelpGroupReplyMutation();
  const [deleteDiscussion] = useDeleteHelpGroupDiscussionMutation();
  const [deleteReply] = useDeleteHelpGroupReplyMutation();
  const [restoreMessage, { isLoading: isRestoring }] =
    useRestoreHelpGroupMessageMutation();
  const isUnderReview = !!message.isUnderReview;
  // Same condition as the author card: never for a deleted account nor a
  // profile the viewer cannot see
  const authorProfileId =
    showAuthorDetails &&
    !message.author.isDeleted &&
    message.author.profileLinkable &&
    message.author.id;
  const apiKind = isDiscussion ? 'discussions' : 'replies';

  const notifyError = (text: string) =>
    dispatch(
      notificationsActions.addNotification({ type: 'danger', message: text })
    );

  const onReact = async (emoji: HelpGroupReactionEmoji | null) => {
    // One reaction request at a time per message: the rollback of a failed
    // request must never undo a newer optimistic change
    if (isReacting) {
      return;
    }
    const result = await setReaction({
      slug,
      discussionId,
      target: isDiscussion ? { discussionId } : { replyId: message.id },
      emoji,
      viewerFirstName: viewer.firstName,
    });
    if ('error' in result && result.error) {
      notifyError(WRITE_ERROR_LABELS.reaction);
    }
  };

  const isEditValid =
    !!editedContent.trim() &&
    editedContent.trim().length <= MESSAGE_MAX_LENGTH &&
    (!isDiscussion ||
      (!!editedTitle.trim() && editedTitle.trim().length <= TITLE_MAX_LENGTH));

  const saveEdit = async () => {
    if (!isEditValid) {
      return;
    }
    const result = isDiscussion
      ? await updateDiscussion({
          slug,
          discussionId,
          dto: { title: editedTitle.trim(), content: editedContent.trim() },
        })
      : await updateReply({
          slug,
          discussionId,
          replyId: message.id,
          content: editedContent.trim(),
        });
    if ('error' in result && result.error) {
      notifyError(WRITE_ERROR_LABELS.edit);
      return;
    }
    setIsEditing(false);
  };

  const confirmDelete = () => {
    const labels = isDiscussion
      ? DELETE_DISCUSSION_CONFIRM
      : DELETE_REPLY_CONFIRM;
    openModal(
      <ModalConfirm
        title={labels.title}
        text={labels.text}
        buttonText={labels.button}
        onConfirm={async () => {
          const result = isDiscussion
            ? await deleteDiscussion({ slug, discussionId })
            : await deleteReply({ slug, discussionId, replyId: message.id });
          if ('error' in result && result.error) {
            notifyError(WRITE_ERROR_LABELS.delete);
            return;
          }
          if (isDiscussion) {
            onDiscussionDeleted?.();
          }
        }}
      />
    );
  };

  const openModeration = () =>
    openModal(
      <ModerationDeleteModal
        kind={apiKind}
        id={message.id}
        slug={slug}
        discussionId={discussionId}
        onDeleted={() => {
          onModerated?.(message.author.isDeleted ? null : message.author.id);
          if (isDiscussion) {
            onDiscussionDeleted?.();
          }
        }}
      />
    );

  const restore = async () => {
    if (isRestoring) {
      return;
    }
    const result = await restoreMessage({ kind: apiKind, id: message.id });
    if ('error' in result && result.error) {
      notifyError(RESTORE_ERROR_LABEL);
    }
  };

  const onAction = async (action: MessageMenuAction) => {
    switch (action) {
      case 'copyLink':
        try {
          await navigator.clipboard.writeText(
            getMessageUrl(
              slug,
              discussionId,
              isDiscussion ? undefined : message.id
            )
          );
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message: LINK_COPIED_LABEL,
            })
          );
        } catch {
          // Clipboard refused by the browser: nothing to confirm
        }
        break;
      case 'edit':
        setEditedTitle(message.title ?? '');
        setEditedContent(message.content);
        setIsEditing(true);
        break;
      case 'delete':
        confirmDelete();
        break;
      case 'revisions':
        openModal(<RevisionsModal kind={apiKind} id={message.id} />);
        break;
      case 'report':
        openModal(
          <HelpGroupReportModal
            slug={slug}
            discussionId={discussionId}
            replyId={isDiscussion ? undefined : message.id}
            author={message.author}
            content={message.content}
          />
        );
        break;
      case 'moderate':
        openModeration();
        break;
      default:
    }
  };

  // The admin decides on a message hidden after reports, from the group,
  // even on their own message
  const showAdminDecision = isUnderReview && viewer.isAdmin;

  return (
    <>
      {showAdminDecision && (
        <StyledHiddenByReportsBanner data-testid="hidden-by-reports-banner">
          <StyledHiddenByReportsText>
            <Text weight="bold">{HIDDEN_BY_REPORTS_BANNER}</Text>
            {!!message.reportReasons?.length && (
              <Text size="small">
                {formatReportReasons(
                  message.reportReasons.map(
                    (reason) => REPORT_REASON_LABELS[reason] ?? reason
                  )
                )}
              </Text>
            )}
          </StyledHiddenByReportsText>
          {canManage && (
            <StyledHiddenByReportsActions>
              <Button
                variant="secondary"
                size="small"
                disabled={isRestoring}
                onClick={restore}
                dataTestId="restore-message"
              >
                {RESTORE_LABEL}
              </Button>
              <Button
                variant="default"
                size="small"
                onClick={openModeration}
                dataTestId="moderate-hidden-message"
              >
                {MODERATION_DELETE_SHORT_LABEL}
              </Button>
            </StyledHiddenByReportsActions>
          )}
        </StyledHiddenByReportsBanner>
      )}
      {isUnderReview && isAuthor && !viewer.isAdmin && (
        <StyledUnderReviewMention data-testid="under-review-mention">
          {UNDER_REVIEW_MENTION}
        </StyledUnderReviewMention>
      )}
      <StyledMessageHeader>
        <StyledMessageMeta>
          <HelpGroupAuthor author={message.author} date={message.createdAt} />
          {message.editedAt && (
            <Text size="small" color="darkGray">
              {EDITED_MENTION}
            </Text>
          )}
          {authorProfileId && (
            <StyledAuthorDetails data-testid="message-author-details">
              {message.author.department && (
                <Text size="small" color="darkGray">
                  {message.author.department}
                </Text>
              )}
              <SimpleLink href={getProfileHref(authorProfileId)}>
                <Text size="small" color="darkBlue" weight="semibold">
                  Voir son profil
                </Text>
              </SimpleLink>
            </StyledAuthorDetails>
          )}
        </StyledMessageMeta>
        <MessageMenu
          actions={
            canManage
              ? getMessageMenuActions({
                  isAuthor,
                  isAdmin: viewer.isAdmin,
                  isEdited: !!message.editedAt,
                  isUnderReview,
                })
              : ['copyLink']
          }
          onAction={onAction}
        />
      </StyledMessageHeader>
      {isEditing ? (
        <StyledMessageEditor data-testid="message-editor">
          {isDiscussion && (
            <TextInput
              id={`edit-title-${message.id}`}
              name="edit-title"
              value={editedTitle}
              maxLength={TITLE_MAX_LENGTH}
              onChange={setEditedTitle}
            />
          )}
          <TextArea
            id={`edit-content-${message.id}`}
            name="edit-content"
            value={editedContent}
            rows={4}
            maxLength={MESSAGE_MAX_LENGTH}
            onChange={setEditedContent}
          />
          <StyledMessageEditorActions>
            <Button variant="default" onClick={() => setIsEditing(false)}>
              {COMPOSER_CANCEL_LABEL}
            </Button>
            <Button
              variant="primary"
              disabled={!isEditValid || isUpdatingDiscussion || isUpdatingReply}
              onClick={saveEdit}
              dataTestId="message-editor-save"
            >
              {EDIT_SAVE_LABEL}
            </Button>
          </StyledMessageEditorActions>
        </StyledMessageEditor>
      ) : (
        <>
          {isDiscussion && message.title && (
            <H1 title={message.title} weight="semibold" noMarginBottom />
          )}
          <HelpGroupContent
            content={message.content}
            guardLinks
            authorIsAdmin={message.author.isAdmin}
          />
        </>
      )}
      <StyledMessageFooter>
        <ReactionsSummary summary={message.reactionsSummary} />
        {canReact && (
          <ReactionPicker
            disabled={isReacting}
            viewerReaction={message.viewerReaction}
            inline={isDiscussion}
            onChange={onReact}
          />
        )}
      </StyledMessageFooter>
    </>
  );
}
