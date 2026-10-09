import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HelpGroupDeletionReason } from '@/src/api/types';
import { Button, LucidIcon, Text } from '@/src/components/ui';
import { Radio, TextArea } from '@/src/components/ui/Inputs';
import {
  MODERATION_DONE_LABEL,
  MODERATION_REASON_LABELS,
  RESTORE_ERROR_LABEL,
  WRITE_ERROR_LABELS,
} from '@/src/features/backoffice/help-groups/help-groups-participation.labels';
import {
  useDeleteHelpGroupMessageAsAdminMutation,
  useRestoreHelpGroupMessageMutation,
} from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import { ReportPanelTitle } from '../ReportPanelTitle';
import { REPORTS_TAB_LABELS } from '../reports.labels';
import {
  StyledReportDecision,
  StyledReportDecisionActions,
  StyledReportDeleteForm,
  StyledReportDeleteFormFooter,
} from './ReportGroupMessageDecision.styles';

const COMMENT_MAX_LENGTH = 500;

const REASON_OPTIONS = Object.entries(MODERATION_REASON_LABELS).map(
  ([value, label]) => ({
    inputId: `report-delete-reason-${value}`,
    value,
    label,
  })
);

interface ReportGroupMessageDecisionProps {
  targetType: 'POST' | 'POST_REPLY';
  targetId: string;
  // Null once the group is deleted: the thread cache is then left as is
  slug: string | null;
  discussionId: string;
  pendingCount: number;
}

/**
 * Decision of an admin on a group message hidden after reports, from its
 * report page: restore it, or delete it with a mandatory reason, shown only
 * once « Supprimer le message » is chosen. Both close its pending reports,
 * and refresh the page, the list and the badge through the `Reports` tag.
 */
export function ReportGroupMessageDecision({
  targetType,
  targetId,
  slug,
  discussionId,
  pendingCount,
}: ReportGroupMessageDecisionProps) {
  const dispatch = useDispatch();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [reason, setReason] = useState<HelpGroupDeletionReason | ''>('');
  const [comment, setComment] = useState('');
  const [restoreMessage, { isLoading: isRestoring }] =
    useRestoreHelpGroupMessageMutation();
  const [deleteMessage, { isLoading: isDeleting }] =
    useDeleteHelpGroupMessageAsAdminMutation();
  const kind = targetType === 'POST' ? 'discussions' : 'replies';
  const isBusy = isRestoring || isDeleting;

  const notify = (type: 'success' | 'danger', message: string) =>
    dispatch(notificationsActions.addNotification({ type, message }));

  const closeDeleteForm = () => {
    setIsDeleteOpen(false);
    setReason('');
    setComment('');
  };

  const restore = async () => {
    if (isBusy) {
      return;
    }
    const result = await restoreMessage({ kind, id: targetId });
    if ('error' in result && result.error) {
      notify('danger', RESTORE_ERROR_LABEL);
      return;
    }
    closeDeleteForm();
    notify('success', REPORTS_TAB_LABELS.restoreDone);
  };

  const confirmDelete = async () => {
    if (!reason || isBusy) {
      return;
    }
    const result = await deleteMessage({
      kind,
      id: targetId,
      dto: { reason, ...(comment.trim() ? { comment: comment.trim() } : {}) },
      ...(slug ? { slug } : {}),
      discussionId,
    });
    if ('error' in result && result.error) {
      notify('danger', WRITE_ERROR_LABELS.delete);
      return;
    }
    closeDeleteForm();
    notify('success', MODERATION_DONE_LABEL);
  };

  return (
    <StyledReportDecision data-testid="report-decision">
      <ReportPanelTitle>{REPORTS_TAB_LABELS.decisionTitle}</ReportPanelTitle>
      <Text size="small" color="darkGray">
        {REPORTS_TAB_LABELS.formatDecisionText(pendingCount)}
      </Text>
      <StyledReportDecisionActions>
        <Button
          variant="secondary"
          disabled={isBusy}
          prependIcon={<LucidIcon name="RotateCcw" />}
          onClick={restore}
          dataTestId="report-decision-restore"
        >
          {REPORTS_TAB_LABELS.restoreMessage}
        </Button>
        <Button
          variant="default"
          color="warning"
          disabled={isBusy}
          prependIcon={<LucidIcon name="Trash2" />}
          onClick={() =>
            isDeleteOpen ? closeDeleteForm() : setIsDeleteOpen(true)
          }
          dataTestId="report-decision-delete"
        >
          {REPORTS_TAB_LABELS.deleteMessage}
        </Button>
      </StyledReportDecisionActions>
      {isDeleteOpen && (
        <StyledReportDeleteForm data-testid="report-decision-delete-form">
          <Radio
            id="report-delete-reason"
            name="report-delete-reason"
            title={REPORTS_TAB_LABELS.deleteReason}
            value={reason}
            onChange={(value) => setReason(value as HelpGroupDeletionReason)}
            options={REASON_OPTIONS}
          />
          <TextArea
            id="report-delete-comment"
            name="report-delete-comment"
            title={REPORTS_TAB_LABELS.deleteComment}
            showLabel
            rows={2}
            maxLength={COMMENT_MAX_LENGTH}
            value={comment}
            onChange={setComment}
          />
          <StyledReportDeleteFormFooter>
            <Button
              variant="text"
              onClick={closeDeleteForm}
              dataTestId="report-decision-delete-cancel"
            >
              {REPORTS_TAB_LABELS.deleteCancel}
            </Button>
            <Button
              variant="primary"
              size="large"
              disabled={!reason || isBusy}
              onClick={confirmDelete}
              dataTestId="report-decision-delete-confirm"
            >
              {REPORTS_TAB_LABELS.deleteConfirm}
            </Button>
          </StyledReportDeleteFormFooter>
        </StyledReportDeleteForm>
      )}
    </StyledReportDecision>
  );
}
