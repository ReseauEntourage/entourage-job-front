import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, ImgProfile } from 'src/components/utils';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { selectLinkedUser } from 'src/use-cases/current-user';
import { isRoleIncluded } from 'src/utils';
import {
  StyledDashboardLinkedUserCard,
  StyledDashboardLinkedUserCardCityContainer,
  StyledDashboardLinkedUserCardContactInfo,
  StyledDashboardLinkedUserCardCTAContainer,
  StyledDashboardLinkedUserNameContainer,
} from './DashboardLinkedUserCard.styles';

export const DashboardLinkedUserCard = () => {
  const user = useAuthenticatedUser();
  const linkedUser = useSelector(selectLinkedUser);
  if (
    !linkedUser ||
    isRoleIncluded([UserRoles.REFERER, UserRoles.ADMIN], user.role)
  ) {
    return null;
  }
  return (
    <Card
      title={
        user.role === UserRoles.COACH
          ? "Le candidat que j'accompagne"
          : "Le coach qui m'accompagne"
      }
      centerTitle
    >
      <StyledDashboardLinkedUserCard>
        <ImgProfile user={linkedUser} size={107} />
        <StyledDashboardLinkedUserNameContainer>
          {linkedUser.firstName} {linkedUser.lastName.charAt(0)}.
        </StyledDashboardLinkedUserNameContainer>
        {linkedUser.userProfile.department && (
          <StyledDashboardLinkedUserCardCityContainer>
            {linkedUser.userProfile.department.toUpperCase()}
          </StyledDashboardLinkedUserCardCityContainer>
        )}
        <StyledDashboardLinkedUserCardContactInfo>
          <span>{linkedUser.phone}</span>
          <Link href={`mailto:${linkedUser.email}`}>{linkedUser.email}</Link>
        </StyledDashboardLinkedUserCardContactInfo>
        <StyledDashboardLinkedUserCardCTAContainer>
          <Button
            variant="secondary"
            rounded
            href={`/backoffice/profile/${linkedUser.id}`}
          >
            Voir le profil
          </Button>
          {user.role === UserRoles.COACH && (
            <Button
              variant="primary"
              rounded
              href={`/backoffice/candidat/${linkedUser.id}/cv`}
            >
              Voir le CV
            </Button>
          )}
        </StyledDashboardLinkedUserCardCTAContainer>
      </StyledDashboardLinkedUserCard>
    </Card>
  );
};
