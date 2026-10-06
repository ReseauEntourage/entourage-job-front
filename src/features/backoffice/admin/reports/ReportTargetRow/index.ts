import { platform } from '@/src/utils/Device';
import { ReportTargetRowDesktop } from './ReportTargetRow.desktop';
import { ReportTargetRowMobile } from './ReportTargetRow.mobile';

export * from './ReportTargetStatusTag';

export const ReportTargetRow = platform({
  Desktop: ReportTargetRowDesktop,
  Mobile: ReportTargetRowMobile,
});
