import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HelpGroupReportReason } from '@/src/api/types';
import { Button, SimpleLink, Text } from '@/src/components/ui';
import { Radio, TextArea } from '@/src/components/ui/Inputs';
import { REPORT_REASONS } from '@/src/constants/reports';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { ModalFooter } from '@/src/features/modals/Modal/ModalGeneric/ModalFooter/ModalFooter';
import { useCurrentUserStaffContact } from '@/src/hooks/useCurrentUserStaffContact';
import {
  HelpGroupsReportError,
  useReportHelpGroupMessageMutation,
} from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import {
  COMPOSER_CANCEL_LABEL,
  REPORT_COMMENT_MAX_LENGTH,
  REPORT_MODAL,
} from '../help-groups-participation.labels';
import {
  StyledReportError,
  StyledReportHelp,
  StyledReportModalContent,
} from './HelpGroupReportModal.styles';

interface HelpGroupReportModalProps {
  slug: string;
  discussionId: string;
  // Absent for the original message of the discussion
  replyId?: string;
}

/**
 * Report of a help group message: a mandatory motive, an optional comment,
 * and whatever the motive, a fixed help box (3114, then one's referent when
 * known). The reported person is not told.
 */
export function HelpGroupReportModal({
  slug,
  discussionId,
  replyId,
}: HelpGroupReportModalProps) {
  const { onClose } = useModalContext();
  const dispatch = useDispatch();
  const staffContact = useCurrentUserStaffContact();
  const [reason, setReason] = useState<HelpGroupReportReason | ''>('');
  const [comment, setComment] = useState('');
  const [showReasonError, setShowReasonError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, { isLoading }] = useReportHelpGroupMessageMutation();

  const send = async () => {
    if (isLoading) {
      return;
    }
    if (!reason) {
      setShowReasonError(true);
      return;
    }
    setError(null);
    const result = await report({
      slug,
      discussionId,
      dto: {
        target: replyId ? { replyId } : { discussionId },
        reason,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      },
    });
    if ('error' in result && result.error) {
      setError(
        result.error === HelpGroupsReportError.ALREADY_REPORTED
          ? REPORT_MODAL.alreadyReported
          : REPORT_MODAL.error
      );
      return;
    }
    onClose?.();
    dispatch(
      notificationsActions.addNotification({
        type: 'success',
        message: REPORT_MODAL.done,
      })
    );
  };

  return (
    <ModalGeneric title={REPORT_MODAL.title} align="left">
      <StyledReportModalContent data-testid="help-group-report-modal">
        <Text>{REPORT_MODAL.text}</Text>
        <Radio
          id="report-reason"
          name="report-reason"
          title={REPORT_MODAL.reasonLabel}
          value={reason}
          onChange={(value) => {
            setReason(value as HelpGroupReportReason);
            setShowReasonError(false);
          }}
          options={REPORT_REASONS.map(({ value, label }) => ({
            inputId: `report-reason-${value}`,
            value,
            label,
          }))}
          error={
            showReasonError
              ? { type: 'required', message: REPORT_MODAL.reasonRequired }
              : undefined
          }
        />
        <TextArea
          id="report-comment"
          name="report-comment"
          title={REPORT_MODAL.commentLabel}
          showLabel
          rows={3}
          maxLength={REPORT_COMMENT_MAX_LENGTH}
          value={comment}
          onChange={setComment}
        />
        <StyledReportHelp data-testid="report-help">
          <Text>
            {REPORT_MODAL.helpBefore}
            <a href="tel:3114">{REPORT_MODAL.helpNumber}</a>
            {REPORT_MODAL.helpAfter}
          </Text>
          {staffContact && (
            <div data-testid="report-referent">
              <Text>
                {REPORT_MODAL.formatReferent(staffContact.name)}{' '}
                <SimpleLink isExternal href={`mailto:${staffContact.email}`}>
                  {staffContact.email}
                </SimpleLink>
              </Text>
            </div>
          )}
        </StyledReportHelp>
        {error && (
          <StyledReportError role="alert" data-testid="report-error">
            {error}
          </StyledReportError>
        )}
      </StyledReportModalContent>
      <ModalFooter>
        <Button variant="default" onClick={onClose} dataTestId="report-cancel">
          {COMPOSER_CANCEL_LABEL}
        </Button>
        <Button
          variant="primary"
          disabled={isLoading}
          onClick={send}
          dataTestId="report-confirm"
        >
          {REPORT_MODAL.confirm}
        </Button>
      </ModalFooter>
    </ModalGeneric>
  );
}
