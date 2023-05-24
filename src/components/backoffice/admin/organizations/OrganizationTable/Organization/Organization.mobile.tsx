import React from 'react';

import { StyledMobileOrganization } from 'src/components/backoffice/admin/organizations/OrganizationTable/Organization/Organization.styles';
import { openModal } from 'src/components/modals/Modal';
import { Button, Icon } from 'src/components/utils';
import { EditOrganizationModal } from './EditOrganizationModal';
import { OrganizationProps } from './Organization.types';
import { OrganizationInfo } from './OrganizationInfo';

export function OrganizationMobile({
  organization,
  refreshOrganizations,
}: OrganizationProps) {
  return (
    <StyledMobileOrganization>
      <div className="line member-head">
        <OrganizationInfo
          name={organization.name}
          address={organization.address}
        />
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
      </div>
      <div className="line phone-sex">
        <div className="cell">
          <span className="title">Contact</span>
          <span>
            {`${organization.organizationReferent.referentFirstName} ${organization.organizationReferent.referentLastName}`}
          </span>
        </div>
        <div className="cell">
          <span className="title">Mail</span>
          <span>{organization.organizationReferent.referentMail}</span>
        </div>
        <div className="cell">
          <span className="title">Téléphone</span>
          <span>{organization.organizationReferent.referentPhone}</span>
        </div>
      </div>

      <div className="line zone-date">
        <div className="cell">
          <span className="title">Zone</span>
          <span>
            {organization.zone.charAt(0).toUpperCase() +
              organization.zone.slice(1).toLowerCase()}
          </span>
        </div>
        <div className="cell">
          <span className="title">Nb. de candidats</span>
          <span>{organization.candidatesCount}</span>
        </div>
        <div className="cell">
          <span className="title">Nb. de coachs</span>
          <span>{organization.coachesCount}</span>
        </div>
      </div>
    </StyledMobileOrganization>
  );
}
