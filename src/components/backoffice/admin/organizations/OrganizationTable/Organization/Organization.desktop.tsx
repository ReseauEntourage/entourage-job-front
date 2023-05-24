import React from 'react';

import { StyledRow } from 'src/components/backoffice/admin/organizations/OrganizationTable/Organization/Organization.styles';
import { openModal } from 'src/components/modals/Modal';
import { Button, Icon } from 'src/components/utils';
import { EditOrganizationModal } from './EditOrganizationModal';
import { OrganizationProps } from './Organization.types';
import { OrganizationInfo } from './OrganizationInfo';

export function OrganizationDesktop({
  organization,
  refreshOrganizations,
}: OrganizationProps) {
  return (
    <StyledRow>
      <td className="name-cell">
        <OrganizationInfo
          name={organization.name}
          address={organization.address}
        />
      </td>
      <td>
        <span>
          {`${organization.organizationReferent.referentFirstName} ${organization.organizationReferent.referentLastName}`}
        </span>
      </td>
      <td>
        <span>{organization.organizationReferent.referentMail}</span>
      </td>
      <td>
        <span>{organization.organizationReferent.referentPhone}</span>
      </td>
      <td>
        <span>
          {organization.zone.charAt(0).toUpperCase() +
            organization.zone.slice(1).toLowerCase()}
        </span>
      </td>
      <td>
        <span>{organization.candidatesCount}</span>
      </td>
      <td>
        <span>{organization.coachesCount}</span>
      </td>
      <td>
        <span>
          <Button
            style="custom-text"
            onClick={() => {
              openModal(
                <EditOrganizationModal
                  organization={organization}
                  refreshOrganizations={refreshOrganizations}
                />
              );
            }}
          >
            <Icon name="pencil" />
          </Button>
        </span>
      </td>
    </StyledRow>
  );
}
