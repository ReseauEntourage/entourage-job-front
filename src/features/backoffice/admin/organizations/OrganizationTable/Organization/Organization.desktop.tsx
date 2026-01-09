import React from 'react';
import { ButtonIcon } from '@/src/components/ui/Button/ButtonIcon';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { TrDesktop, TdDesktop } from '@/src/components/ui/Table';
import { openModal } from '@/src/features/modals/Modal';
import { EditOrganizationModal } from './EditOrganizationModal';
import { OrganizationProps } from './Organization.types';
import { OrganizationInfo } from './OrganizationInfo';

export function OrganizationDesktop({
  organization,
  refreshOrganizations,
}: OrganizationProps) {
  return (
    <TrDesktop>
      <TdDesktop>
        <OrganizationInfo
          name={organization.name}
          address={organization.address}
        />
      </TdDesktop>

      <TdDesktop>
        <span>
          {`${organization.organizationReferent?.referentFirstName} ${organization.organizationReferent?.referentLastName}`}
        </span>
      </TdDesktop>
      <TdDesktop>
        <span>{organization.organizationReferent?.referentMail}</span>
      </TdDesktop>
      <TdDesktop>
        <span>{organization.organizationReferent?.referentPhone}</span>
      </TdDesktop>
      <TdDesktop>
        <span>
          {organization.zone.charAt(0).toUpperCase() +
            organization.zone.slice(1).toLowerCase()}
        </span>
      </TdDesktop>
      <TdDesktop>
        <span>{organization.referersCount}</span>
      </TdDesktop>
      <TdDesktop>
        <span>{organization.candidatesCount}</span>
      </TdDesktop>
      <TdDesktop>
        <span>
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
        </span>
      </TdDesktop>
    </TrDesktop>
  );
}
