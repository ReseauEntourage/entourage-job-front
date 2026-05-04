import { platform } from 'src/utils/Device';
import { RefererCandidatesTableDesktop } from './RefererCandidatesTable.desktop';
import { RefererCandidatesTableMobile } from './RefererCandidatesTable.mobile';

export const RefererCandidatesTable = platform({
  Desktop: RefererCandidatesTableDesktop,
  Mobile: RefererCandidatesTableMobile,
});
