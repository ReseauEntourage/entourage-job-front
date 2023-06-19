import { Organization } from 'src/api/types';

export interface OrganizationProps {
  organization: Organization;
  refreshOrganizations: () => void;
}
