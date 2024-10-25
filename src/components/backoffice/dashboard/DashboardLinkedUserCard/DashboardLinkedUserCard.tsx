import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, ImgProfile } from 'src/components/utils';
import { USER_ROLES } from 'src/constants/users';
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
    isRoleIncluded([USER_ROLES.REFERRER, USER_ROLES.ADMIN], user.role)
  ) {
    return null;
  }
  return (
    <Card
      title={
        user.role === USER_ROLES.COACH
          ? "Le candidat que j'accompagne"
          : "Le coach qui m'accompagne"
      }
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
            style="custom-secondary"
            href={`/backoffice/profile/${linkedUser.id}`}
          >
            Voir le profil
          </Button>
          {user.role === USER_ROLES.COACH && (
            <Button
              style="custom-secondary-inverted"
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
