import { ReportDto } from '@/src/api/types';

export enum ReportSubmitResult {
  SENT = 'SENT',
  // A report of the same person on this content is still to handle (409)
  ALREADY_REPORTED = 'ALREADY_REPORTED',
  FAILED = 'FAILED',
}

export interface ReportExcerpt {
  // As displayed on the message, e.g. "Malik R."
  authorName: string;
  // Plain text, cut by the modal
  content: string;
}

export interface ReportModalProps {
  title: string;
  // Sends the report; never throws, the outcome drives the modal
  onSubmit: (dto: ReportDto) => Promise<ReportSubmitResult>;
  // E.g. the content of a suspicious message, still editable
  defaultComment?: string | null;
  /**
   * The reported message, recalled above the motives so that the person
   * checks what they report. Only for a help group message.
   */
  excerpt?: ReportExcerpt;
  dataTestId?: string;
}
