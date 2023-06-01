import React from 'react';

import { openModal } from 'src/components/modals/Modal';
import { Button, Icon } from 'src/components/utils';
import { Row, Td } from 'src/components/utils/Table';
import { EditOrganizationModal } from './EditOrganizationModal';
import { StyledNameCellContainer } from './Organization.styles';
import { OrganizationProps } from './Organization.types';
import { OrganizationInfo } from './OrganizationInfo';

export function OrganizationDesktop({
  organization,
  refreshOrganizations,
}: OrganizationProps) {
  return (
    <Row>
      <StyledNameCellContainer>
        <OrganizationInfo
          name={organization.name}
          address={organization.address}
        />
      </StyledNameCellContainer>

      <Td>
        <span>
          {`${organization.organizationReferent.referentFirstName} ${organization.organizationReferent.referentLastName}`}
        </span>
      </Td>
      <Td>
        <span>{organization.organizationReferent.referentMail}</span>
      </Td>
      <Td>
        <span>{organization.organizationReferent.referentPhone}</span>
      </Td>
      <Td>
        <span>
          {organization.zone.charAt(0).toUpperCase() +
            organization.zone.slice(1).toLowerCase()}
        </span>
      </Td>
      <Td>
        <span>{organization.candidatesCount}</span>
      </Td>
      <Td>
        <span>{organization.coachesCount}</span>
      </Td>
      <Td>
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
      </Td>
    </Row>
  );
}
