import { platform } from 'src/utils/Device';
import { CompanyCollaboratorsTableDesktop } from './CompanyCollaboratorsTable.desktop';
import { CompanyCollaboratorsTableMobile } from './CompanyCollaboratorsTable.mobile';

export const CompanyCollaboratorsTable = platform({
  Desktop: CompanyCollaboratorsTableDesktop,
  Mobile: CompanyCollaboratorsTableMobile,
});
