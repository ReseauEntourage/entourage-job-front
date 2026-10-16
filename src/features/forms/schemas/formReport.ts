import { ReportReasonValue, REPORT_REASONS } from '@/src/constants/reports';

// Same limit as the back, for the three kinds of report
export const REPORT_COMMENT_MAX_LENGTH = 1000;

export interface ReportFormValues {
  reason: ReportReasonValue | '';
  comment: string;
}

/**
 * Form shared by the conversation, profile and help group message reports:
 * a mandatory motive among the shared ones, and an optional comment.
 */
export const formReport = {
  id: 'form-report',
  reasons: REPORT_REASONS.map(({ value, label }) => ({ value, label })),
  commentMaxLength: REPORT_COMMENT_MAX_LENGTH,
  /** True while the form cannot be sent: the motive is the only mandatory field */
  isReasonMissing: ({ reason }: Pick<ReportFormValues, 'reason'>) => !reason,
  /** The comment is sent only when it holds something besides spaces */
  toDto: ({ reason, comment }: ReportFormValues) => ({
    reason: reason as ReportReasonValue,
    ...(comment.trim() ? { comment: comment.trim() } : {}),
  }),
};
