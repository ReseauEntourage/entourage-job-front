import { ReportDto } from '@/src/api/types';

export enum ReportSubmitResult {
  SENT = 'SENT',
  // A report of the same person on this content is still to handle (409)
  ALREADY_REPORTED = 'ALREADY_REPORTED',
  FAILED = 'FAILED',
}

export interface ReportModalProps {
  title: string;
  // Sends the report; never throws, the outcome drives the modal
  onSubmit: (dto: ReportDto) => Promise<ReportSubmitResult>;
  // E.g. the content of a suspicious message, still editable
  defaultComment?: string | null;
  dataTestId?: string;
}
