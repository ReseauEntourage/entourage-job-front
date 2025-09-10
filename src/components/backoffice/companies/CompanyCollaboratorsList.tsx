import React, { useMemo } from 'react';
import { CompanyWithUsers } from '@/src/api/types';
import { HeaderBackoffice } from '../../headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from '../../headers/HeaderBackoffice/HeaderBackoffice.styles';
import { CompanyInviteCollaboratorsModal } from '../../modals/CompanyInviteCollaboratorsModal/CompanyInviteCollaboratorsModal';
import { openModal } from '../../modals/Modal';
import { Table, TdDesktop, Th, TrDesktop } from '../../utils/Table';
import { Button, Section } from 'src/components/utils';
import { StyledHeaderCompanyCollaboratorsList } from './CompanyCollaboratorsList.styles';

export interface CompanyCollaboratorsListProps {
  companyWithCollaborators: CompanyWithUsers;
}

interface TableItem {
  id: string;
  name: string;
  email: string;
  connectionCounter: string;
  invitedAt: string;
  accountCreated: string;
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

    const itemsFromUsers: TableItem[] = companyWithCollaborators.users.map(
      (user) => ({
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
      })
    );

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
        <Table
          columns={[
            <Th key="collaboratorName">Collaborateurs</Th>,
            <Th key="collaboratorEmail">Mail</Th>,
            <Th key="collaboratorConnectionCounter">Candidats contactés</Th>,
            <Th key="collaboratorInvitedAt">Invitation envoyée</Th>,
            <Th key="collaboratorAccountCreated">Compte créé</Th>,
          ]}
          dataTestId="member-list"
          body={items.map((item) => (
            <TrDesktop key={item.id}>
              <TdDesktop>
                <b>{item.name}</b>
              </TdDesktop>
              <TdDesktop>{item.email}</TdDesktop>
              <TdDesktop>{item.connectionCounter}</TdDesktop>
              <TdDesktop>{item.invitedAt}</TdDesktop>
              <TdDesktop>{item.accountCreated}</TdDesktop>
            </TrDesktop>
          ))}
        />
      </Section>
    </>
  );
};
