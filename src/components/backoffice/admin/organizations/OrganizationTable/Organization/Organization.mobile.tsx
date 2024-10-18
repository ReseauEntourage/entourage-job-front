import React from 'react';

import { openModal } from 'src/components/modals/Modal';
import { ButtonIcon } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { TdMobile, TrMobile } from 'src/components/utils/Table';
import { EditOrganizationModal } from './EditOrganizationModal';
import { OrganizationProps } from './Organization.types';
import { OrganizationInfo } from './OrganizationInfo';

export function OrganizationMobile({
  organization,
  refreshOrganizations,
}: OrganizationProps) {
  return (
    <TrMobile>
      <div className="line">
        <TdMobile>
          <OrganizationInfo
            name={organization.name}
            address={organization.address}
          />
          <ButtonIcon
            icon={<LucidIcon name="Pencil" />}
            dataTestId={`button-edit-organization-${organization.id}`}
            onClick={() => {
              openModal(
                <EditOrganizationModal
                  organization={organization}
                  refreshOrganizations={refreshOrganizations}
                />
              );
            }}
          />
        </TdMobile>
      </div>
      <div className="line">
        <TdMobile title="Contact">
          <span>
            {`${organization.organizationReferent?.referentFirstName} ${organization.organizationReferent?.referentLastName}`}
          </span>
        </TdMobile>
        <TdMobile title="Zone">
          <span>
            {organization.zone.charAt(0).toUpperCase() +
              organization.zone.slice(1).toLowerCase()}
          </span>
        </TdMobile>
      </div>
      <div className="line">
        <TdMobile title="Mail">
          <span>{organization.organizationReferent?.referentMail}</span>
        </TdMobile>
        <TdMobile title="Téléphone">
          <span>{organization.organizationReferent?.referentPhone}</span>
        </TdMobile>
      </div>

      <div className="line">
        <TdMobile title="Nb. de candidats">
          <span>{organization.candidatesCount}</span>
        </TdMobile>
        <TdMobile title="Nb. de coachs">
          <span>{organization.coachesCount}</span>
        </TdMobile>
      </div>
    </TrMobile>
  );
}
