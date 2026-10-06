import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, SimpleLink, Text } from '@/src/components/ui';
import { Radio, TextArea } from '@/src/components/ui/Inputs';
import { ReportReasonValue } from '@/src/constants/reports';
import { formReport } from '@/src/features/forms/schemas/formReport';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { ModalFooter } from '@/src/features/modals/Modal/ModalGeneric/ModalFooter/ModalFooter';
import { useCurrentUserStaffContact } from '@/src/hooks/useCurrentUserStaffContact';
import { notificationsActions } from '@/src/use-cases/notifications';
import { REPORT_MODAL_LABELS } from './ReportModal.labels';
import {
  StyledReportError,
  StyledReportHelp,
  StyledReportModalContent,
  StyledReportReferent,
} from './ReportModal.styles';
import { ReportModalProps, ReportSubmitResult } from './ReportModal.types';

/**
 * Report modal shared by the conversations, the profiles and the help group
 * messages: a mandatory motive, an optional comment, and whatever the motive
 * a fixed help box (3114, then one's referent when known). The reported
 * person is not told.
 */
export function ReportModal({
  title,
  onSubmit,
  defaultComment,
  dataTestId = 'report-modal',
}: ReportModalProps) {
  const { onClose } = useModalContext();
  const dispatch = useDispatch();
  const staffContact = useCurrentUserStaffContact();
  const [reason, setReason] = useState<ReportReasonValue | ''>('');
  const [comment, setComment] = useState(defaultComment || '');
  const [showReasonError, setShowReasonError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const send = async () => {
    if (isSending) {
      return;
    }
    if (formReport.isReasonMissing({ reason })) {
      setShowReasonError(true);
      return;
    }
    setError(null);
    setIsSending(true);
    const result = await onSubmit(formReport.toDto({ reason, comment }));
    setIsSending(false);
    if (result !== ReportSubmitResult.SENT) {
      setError(
        result === ReportSubmitResult.ALREADY_REPORTED
          ? REPORT_MODAL_LABELS.alreadyReported
          : REPORT_MODAL_LABELS.error
      );
      return;
    }
    onClose?.();
    dispatch(
      notificationsActions.addNotification({
        type: 'success',
        message: REPORT_MODAL_LABELS.done,
      })
    );
  };

  return (
    <ModalGeneric title={title} align="left">
      <StyledReportModalContent data-testid={dataTestId}>
        <Text>{REPORT_MODAL_LABELS.text}</Text>
        <Radio
          id="report-reason"
          name="report-reason"
          title={REPORT_MODAL_LABELS.reasonLabel}
          value={reason}
          onChange={(value) => {
            setReason(value as ReportReasonValue);
            setShowReasonError(false);
          }}
          options={formReport.reasons.map(({ value, label }) => ({
            inputId: `report-reason-${value}`,
            value,
            label,
          }))}
          error={
            showReasonError
              ? {
                  type: 'required',
                  message: REPORT_MODAL_LABELS.reasonRequired,
                }
              : undefined
          }
        />
        <TextArea
          id="report-comment"
          name="report-comment"
          title={REPORT_MODAL_LABELS.commentLabel}
          showLabel
          rows={3}
          maxLength={formReport.commentMaxLength}
          value={comment}
          onChange={setComment}
        />
        <StyledReportHelp data-testid="report-help">
          <Text>
            {REPORT_MODAL_LABELS.helpBefore}
            <SimpleLink isExternal href="tel:3114">
              {REPORT_MODAL_LABELS.helpNumber}
            </SimpleLink>
            {REPORT_MODAL_LABELS.helpAfter}
          </Text>
          {staffContact && (
            <StyledReportReferent data-testid="report-referent">
              <Text>
                {REPORT_MODAL_LABELS.formatReferent(staffContact.name)}{' '}
                <SimpleLink isExternal href={`mailto:${staffContact.email}`}>
                  {staffContact.email}
                </SimpleLink>
              </Text>
            </StyledReportReferent>
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
          {REPORT_MODAL_LABELS.cancel}
        </Button>
        <Button
          variant="primary"
          disabled={isSending}
          onClick={send}
          dataTestId="report-confirm"
        >
          {REPORT_MODAL_LABELS.confirm}
        </Button>
      </ModalFooter>
    </ModalGeneric>
  );
}
