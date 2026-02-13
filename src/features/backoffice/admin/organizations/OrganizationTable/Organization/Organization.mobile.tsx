import React from 'react';
import { ButtonIcon } from '@/src/components/ui/Button/ButtonIcon';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { TdMobile, TrMobile } from '@/src/components/ui/Table';
import { openModal } from '@/src/features/modals/Modal';
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
        <TdMobile title="Candidats">
          <span>{organization.candidatesCount}</span>
        </TdMobile>
        <TdMobile title="Prescripteurs">
          <span>{organization.referersCount}</span>
        </TdMobile>
      </div>
    </TrMobile>
  );
}
