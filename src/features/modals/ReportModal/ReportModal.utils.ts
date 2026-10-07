import { isAxiosError } from 'axios';
import { ReportSubmitResult } from './ReportModal.types';

/**
 * Outcome of a report sent through an Axios call: a 409 means that a report
 * of the same person is still to handle.
 */
export const sendReport = async (
  call: () => Promise<unknown>
): Promise<ReportSubmitResult> => {
  try {
    await call();
    return ReportSubmitResult.SENT;
  } catch (error) {
    return isAxiosError(error) && error.response?.status === 409
      ? ReportSubmitResult.ALREADY_REPORTED
      : ReportSubmitResult.FAILED;
  }
};

// Length of the excerpt of a reported message, ellipsis excluded
export const REPORT_EXCERPT_MAX_LENGTH = 120;

/**
 * Beginning of a reported message, on a single line: line breaks and runs of
 * spaces are collapsed, then the text is cut at the last word boundary before
 * the limit, with an ellipsis.
 */
export const truncateExcerpt = (
  content: string,
  maxLength = REPORT_EXCERPT_MAX_LENGTH
): string => {
  const text = content.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) {
    return text;
  }
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  // A single long word (a link) is cut as is
  const kept = lastSpace > maxLength / 2 ? cut.slice(0, lastSpace) : cut;
  return `${kept.replace(/[\s.,;:!?…-]+$/, '')}…`;
};
