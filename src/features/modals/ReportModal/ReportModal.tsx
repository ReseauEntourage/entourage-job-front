import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, LegacyImg, SimpleLink, Text } from '@/src/components/ui';
import { Radio, TextArea } from '@/src/components/ui/Inputs';
import { ReportReasonValue } from '@/src/constants/reports';
import { formReport } from '@/src/features/forms/schemas/formReport';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { useCurrentUserStaffContact } from '@/src/hooks/useCurrentUserStaffContact';
import { useIsDesktop } from '@/src/hooks/utils';
import { notificationsActions } from '@/src/use-cases/notifications';
import { REPORT_MODAL_LABELS } from './ReportModal.labels';
import {
  StyledReportError,
  StyledReportExcerpt,
  StyledReportExcerptAuthor,
  StyledReportHelp,
  StyledReportModalContent,
  StyledReportReferent,
  StyledReportReferentIdentity,
  StyledReportReferentPicture,
} from './ReportModal.styles';
import { ReportModalProps, ReportSubmitResult } from './ReportModal.types';
import { truncateExcerpt } from './ReportModal.utils';

/**
 * Report modal shared by the conversations, the profiles and the help group
 * messages: a mandatory motive, an optional comment, and whatever the motive
 * a fixed help box (3114, then one's referent when known). The reported
 * person is not told. For a help group message, the author and the beginning
 * of the message are recalled above the motives.
 *
 * Below the desktop breakpoint, it rises from the bottom of the screen, its
 * actions fixed under the scrolling body.
 */
export function ReportModal({
  title,
  onSubmit,
  defaultComment,
  excerpt,
  dataTestId = 'report-modal',
}: ReportModalProps) {
  const { onClose } = useModalContext();
  const dispatch = useDispatch();
  const staffContact = useCurrentUserStaffContact();
  const isDesktop = useIsDesktop();
  const [reason, setReason] = useState<ReportReasonValue | ''>('');
  // A long suspicious message is cut to the limit the back accepts
  const [comment, setComment] = useState(
    (defaultComment || '').slice(0, formReport.commentMaxLength)
  );
  const [showReasonError, setShowReasonError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // The error sits at the end of the scrolling body: in the bottom sheet it
  // would stay out of view under the help box, so bring it into view.
  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView?.({ block: 'nearest' });
    }
  }, [error]);

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
    <ModalGeneric
      title={title}
      align="left"
      variant="sheet"
      footerLayout="end"
      footer={
        <>
          <Button
            variant="default"
            onClick={onClose}
            dataTestId="report-cancel"
          >
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
        </>
      }
    >
      <StyledReportModalContent data-testid={dataTestId}>
        <Text color="darkGray">{REPORT_MODAL_LABELS.text}</Text>
        {excerpt && (
          <StyledReportExcerpt
            aria-label={REPORT_MODAL_LABELS.excerptLabel}
            data-testid="report-excerpt"
          >
            <Text size="small" color="darkGray">
              <StyledReportExcerptAuthor>
                {excerpt.authorName}
              </StyledReportExcerptAuthor>
              {' · '}
              {REPORT_MODAL_LABELS.formatExcerpt(
                truncateExcerpt(excerpt.content)
              )}
            </Text>
          </StyledReportExcerpt>
        )}
        <Radio
          id="report-reason"
          name="report-reason"
          title={REPORT_MODAL_LABELS.reasonLabel}
          variant="cards"
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
          <Text size="small">
            {REPORT_MODAL_LABELS.helpBefore}
            <SimpleLink isExternal href="tel:3114">
              {REPORT_MODAL_LABELS.helpNumber}
            </SimpleLink>
            {REPORT_MODAL_LABELS.helpAfter}
          </Text>
          {staffContact && (
            <StyledReportReferent data-testid="report-referent">
              <StyledReportReferentPicture
                role="img"
                aria-label={REPORT_MODAL_LABELS.formatReferentPhoto(
                  staffContact.name
                )}
              >
                <LegacyImg src={staffContact.img} alt="" cover />
              </StyledReportReferentPicture>
              <StyledReportReferentIdentity>
                <Text color="primaryBlue" weight="semibold">
                  {staffContact.name}
                </Text>
                <Text size="small" color="darkGray">
                  {REPORT_MODAL_LABELS.referentRole}
                </Text>
              </StyledReportReferentIdentity>
              <Button
                variant="secondary"
                size="small"
                rounded
                isExternal
                href={`mailto:${staffContact.email}`}
              >
                {isDesktop
                  ? REPORT_MODAL_LABELS.referentWrite
                  : REPORT_MODAL_LABELS.referentWriteShort}
              </Button>
            </StyledReportReferent>
          )}
        </StyledReportHelp>
        {error && (
          <StyledReportError
            ref={errorRef}
            role="alert"
            data-testid="report-error"
          >
            {error}
          </StyledReportError>
        )}
      </StyledReportModalContent>
    </ModalGeneric>
  );
}
