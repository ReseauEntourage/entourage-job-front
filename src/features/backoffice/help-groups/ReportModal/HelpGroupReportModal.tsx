import React from 'react';
import { ReportDto } from '@/src/api/types';
import {
  REPORT_MODAL_TITLES,
  ReportModal,
  ReportSubmitResult,
} from '@/src/features/modals/ReportModal';
import {
  HelpGroupsReportError,
  useReportHelpGroupMessageMutation,
} from '@/src/use-cases/help-groups';

interface HelpGroupReportModalProps {
  slug: string;
  discussionId: string;
  // Absent for the original message of the discussion
  replyId?: string;
}

/**
 * Report of a help group message, through the shared report modal.
 */
export function HelpGroupReportModal({
  slug,
  discussionId,
  replyId,
}: HelpGroupReportModalProps) {
  const [report] = useReportHelpGroupMessageMutation();

  const onSubmit = async (dto: ReportDto) => {
    const result = await report({
      slug,
      discussionId,
      dto: { target: replyId ? { replyId } : { discussionId }, ...dto },
    });
    if ('error' in result && result.error) {
      return result.error === HelpGroupsReportError.ALREADY_REPORTED
        ? ReportSubmitResult.ALREADY_REPORTED
        : ReportSubmitResult.FAILED;
    }
    return ReportSubmitResult.SENT;
  };

  return (
    <ReportModal
      title={REPORT_MODAL_TITLES.message}
      onSubmit={onSubmit}
      dataTestId="help-group-report-modal"
    />
  );
}
