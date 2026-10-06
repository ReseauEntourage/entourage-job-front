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
