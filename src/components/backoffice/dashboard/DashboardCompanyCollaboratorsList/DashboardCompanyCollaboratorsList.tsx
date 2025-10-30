import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from '@/src/api';
import { CompanyWithUsers } from '@/src/api/types';
import { CollaboratorSmallCard } from '@/src/components/companies/CollaboratorSmallCard/CollaboratorSmallCard';
import { CompanyInviteCollaboratorsModal } from '@/src/components/modals/CompanyInviteCollaboratorsModal/CompanyInviteCollaboratorsModal';
import { openModal } from '@/src/components/modals/Modal';
import { Button, Card, Text } from '@/src/components/utils';
import { notificationsActions } from '@/src/use-cases/notifications';
import { IlluReseau } from 'assets/icons/icons';
import {
  StyledCollaboratorSmallCardContainer,
  StyledContainer,
  StyledCtaContainer,
  StyledEmptyContainer,
  StyledIlluContainer,
} from './DashboardCompanyCollaboratorsList.styles';

interface DashboardCompanyCollaboratorsListProps {
  companyId: string;
}

export const DashboardCompanyCollaboratorsList = ({
  companyId,
}: DashboardCompanyCollaboratorsListProps) => {
  const dispatch = useDispatch();
  const [companyWithCollaborators, setCompanyWithCollaborators] =
    React.useState<CompanyWithUsers | null>(null);
  const [fetchCollaboratorsLoading, setFetchCollaboratorsLoading] =
    React.useState(true);

  const items = useMemo(() => {
    const itemsFromUsers = companyWithCollaborators?.users
      .filter((user) => !user.companyUser.isAdmin)
      .map((user) => ({
        user,
      }));
    const itemsFromInvitations =
      companyWithCollaborators?.pendingInvitations.map((invitation) => ({
        email: invitation.email,
      }));
    return [...(itemsFromUsers || []), ...(itemsFromInvitations || [])].slice(
      0,
      9
    );
  }, [
    companyWithCollaborators?.users,
    companyWithCollaborators?.pendingInvitations,
  ]);

  const handleInviteCollabs = () => {
    if (!companyId) return;
    openModal(<CompanyInviteCollaboratorsModal companyId={companyId} />);
  };

  useEffect(() => {
    setFetchCollaboratorsLoading(true);
    Api.getCompanyByIdWithUsersAndPendingInvitations(companyId)
      .then((response) => {
        setCompanyWithCollaborators(response.data);
        setFetchCollaboratorsLoading(false);
      })
      .catch((error) => {
        setFetchCollaboratorsLoading(false);
        console.error('Error fetching company collaborators:', error);
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message:
              "Une erreur s'est produite lors de la récupération des collaborateurs de l'entreprise",
          })
        );
      });
  }, [companyId, dispatch]);

  // If there are no collaborators or pending invitations, we show a placeholder
  if (!fetchCollaboratorsLoading && items.length === 0) {
    return (
      <Card title="Vous souhaitez engager vos collaborateurs ?" centerTitle>
        <StyledEmptyContainer>
          <StyledIlluContainer>
            <IlluReseau width={60} height={60} />
          </StyledIlluContainer>
          <div>
            <Text weight="bold">
              Invitez vos collaborateurs à devenir coachs bénévoles
            </Text>
            <Text>
              La mission de coach consiste à donner des coups de pouces à des
              personnes isolées en recherche d&apos;emploi pour qu&apos;elles
              aient toutes les cartes en main pour appréhender le monde
              professionnel et y trouver leur place. Un format d’engagement
              souple, qui permet de s’engager selon ses disponibilités.
            </Text>
            <Button
              variant="text"
              onClick={() => {
                handleInviteCollabs();
              }}
              color="primaryBlue"
            >
              En savoir plus
            </Button>
          </div>
        </StyledEmptyContainer>

        <StyledCtaContainer>
          <Button variant="primary" onClick={handleInviteCollabs} rounded>
            Inviter mes collaborateurs
          </Button>
        </StyledCtaContainer>
      </Card>
    );
  }

  return (
    <Card title="Mes collaborateurs d'entreprise" centerTitle>
      <StyledContainer>
        <StyledCollaboratorSmallCardContainer>
          {items.map((item) =>
            'user' in item ? (
              <CollaboratorSmallCard
                key={`collaborator-small-card-${item.user.id}`}
                user={item.user}
              />
            ) : (
              <CollaboratorSmallCard
                key={`invitation-small-card-${item.email}`}
                email={item.email}
              />
            )
          )}
        </StyledCollaboratorSmallCardContainer>
        <StyledCtaContainer>
          <Button href={`/backoffice/companies/${companyId}/collaborators`}>
            Voir tous les collaborateurs
          </Button>
        </StyledCtaContainer>
      </StyledContainer>
    </Card>
  );
};
