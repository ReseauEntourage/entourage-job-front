import React from 'react';
import { HelpGroupAuthor, ReportDto } from '@/src/api/types';
import {
  REPORT_MODAL_TITLES,
  ReportModal,
  ReportSubmitResult,
} from '@/src/features/modals/ReportModal';
import {
  HelpGroupsReportError,
  useReportHelpGroupMessageMutation,
} from '@/src/use-cases/help-groups';
import { formatAuthorName } from '../help-groups.labels';

interface HelpGroupReportModalProps {
  slug: string;
  discussionId: string;
  // Absent for the original message of the discussion
  replyId?: string;
  // The reported message, recalled in the modal
  author: Pick<HelpGroupAuthor, 'isDeleted' | 'firstName' | 'lastNameInitial'>;
  content: string;
}

/**
 * Report of a help group message, through the shared report modal, which
 * recalls its author and the beginning of its content.
 */
export function HelpGroupReportModal({
  slug,
  discussionId,
  replyId,
  author,
  content,
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
      excerpt={{ authorName: formatAuthorName(author), content }}
      dataTestId="help-group-report-modal"
    />
  );
}
