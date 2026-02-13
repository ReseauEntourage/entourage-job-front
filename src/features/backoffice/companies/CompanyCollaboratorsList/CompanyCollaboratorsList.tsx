import React, { useMemo } from 'react';
import { CompanyWithUsers } from '@/src/api/types';
import { Button, Section } from '@/src/components/ui';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from '@/src/features/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { CompanyInviteCollaboratorsModal } from '../../../modals/CompanyInviteCollaboratorsModal/CompanyInviteCollaboratorsModal';
import { openModal } from '../../../modals/Modal';
import { StyledHeaderCompanyCollaboratorsList } from './CompanyCollaboratorsList.styles';
import { CompanyCollaboratorsTable } from './CompanyCollaboratorsTable/CompanyCollaboratorsTable';
import { TableItem } from './CompanyCollaboratorsTable/CompanyCollaboratorsTable.types';

export interface CompanyCollaboratorsListProps {
  companyWithCollaborators: CompanyWithUsers;
}

export const CompanyCollaboratorsList = ({
  companyWithCollaborators,
}: CompanyCollaboratorsListProps) => {
  const items = useMemo(() => {
    const itemsFromInvitations: TableItem[] =
      companyWithCollaborators.pendingInvitations
        ? companyWithCollaborators.pendingInvitations.map((invitation) => ({
            id: invitation.id,
            name: '-',
            email: invitation.email,
            connectionCounter: '-',
            invitedAt: new Date(invitation.createdAt).toLocaleDateString('fr'),
            accountCreated: '-', // No account created date for invitations
          }))
        : [];

    const itemsFromUsers: TableItem[] = companyWithCollaborators.users
      .filter((user) => !user.companyUser.isAdmin)
      .map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        connectionCounter: `${user.conversations.length} candidat${
          user.conversations.length > 1 ? 's' : ''
        }`,
        invitedAt: user.invitations?.[0]?.createdAt
          ? new Date(user.invitations[0].createdAt).toLocaleDateString('fr')
          : '-',
        accountCreated: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString('fr')
          : '-',
      }));

    return [...itemsFromInvitations, ...itemsFromUsers] as TableItem[];
  }, [
    companyWithCollaborators.pendingInvitations,
    companyWithCollaborators.users,
  ]);

  const openInviteModal = () => {
    openModal(
      <CompanyInviteCollaboratorsModal
        companyId={companyWithCollaborators.id}
      />
    );
  };

  return (
    <>
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <StyledHeaderCompanyCollaboratorsList>
            <HeaderBackoffice
              title="Gestion de vos collaborateurs"
              description="Retrouvez la liste de tous vos collaborateurs d’entreprise"
              noSeparator
            />
            <Button variant="secondary" onClick={openInviteModal}>
              Inviter vos collaborateurs
            </Button>
          </StyledHeaderCompanyCollaboratorsList>
        </Section>
      </StyledBackgroundedHeaderBackoffice>

      <Section className="custom-page">
        <CompanyCollaboratorsTable items={items} />
      </Section>
    </>
  );
};
