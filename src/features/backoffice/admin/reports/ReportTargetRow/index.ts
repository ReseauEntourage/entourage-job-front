import { platform } from '@/src/utils/Device';
import { ReportTargetRowDesktop } from './ReportTargetRow.desktop';
import { ReportTargetRowMobile } from './ReportTargetRow.mobile';

// A reported target as a card, laid out per device
export const ReportTargetRow = platform({
  Desktop: ReportTargetRowDesktop,
  Mobile: ReportTargetRowMobile,
});
