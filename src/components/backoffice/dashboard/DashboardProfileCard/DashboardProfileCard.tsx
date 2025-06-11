import React from 'react';
import { ProfileHelps } from '@/src/constants/nudges';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { useContextualRole } from '../../useContextualRole';
import {
  Button,
  Card,
  ImgProfile,
  SimpleLink,
  Tag,
  Text,
} from 'src/components/utils';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  StyledDashboardCTAContainer,
  StyledDashboardProfileCardIntroduction,
  StyledDashboardProfileCardHelpList,
  StyledDashboardProfileCardHelpListEmptyState,
  StyledDashboardProfileCardHelps,
  StyledDashboardProfileCardhelpsTitle,
  StyledDashboardProfileCardPictureName,
} from './DashboardProfileCard.styles';

export const DashboardProfileCard = () => {
  const user = useAuthenticatedUser();
  const { contextualRole } = useContextualRole(user.role);

  return (
    <Card dataTestId="dashboard-profile-card">
      <StyledDashboardProfileCardPictureName>
        <ImgProfile user={user} size={69} />
        <div>
          <Text size="xlarge" weight="bold">
            {`${user.firstName} ${user.lastName.charAt(0).toUpperCase()}.`}
          </Text>
          {user.organization && <Text>{user.organization.name}</Text>}
          {user.userProfile.department && (
            <Text>{user.userProfile.department}</Text>
          )}
          {user.userProfile.linkedinUrl && (
            <SimpleLink
              isExternal
              target="_blank"
              href={user.userProfile.linkedinUrl}
            >
              Profil Linkedin
            </SimpleLink>
          )}
        </div>
      </StyledDashboardProfileCardPictureName>
      {user.userProfile.introduction && (
        <StyledDashboardProfileCardIntroduction>
          {user.userProfile.introduction}
        </StyledDashboardProfileCardIntroduction>
      )}

      {user.userProfile.nudges && (
        <StyledDashboardProfileCardHelps>
          <StyledDashboardProfileCardhelpsTitle>
            Mes {contextualRole === UserRoles.CANDIDATE && 'besoins de '} coups
            de pouce
          </StyledDashboardProfileCardhelpsTitle>
          {user.userProfile.nudges.length > 0 ? (
            <StyledDashboardProfileCardHelpList>
              {user.userProfile.nudges.slice(0, 3).map((nudge, index) => {
                const nudgeDetails = ProfileHelps.find(
                  (nudgeConstant) => nudgeConstant.value === nudge?.value
                );
                if (nudgeDetails) {
                  const tagContent = nudgeDetails.shortTitle[contextualRole];
                  return <Tag key={index} content={tagContent} />;
                }
                return null;
              })}
              {user.userProfile.nudges.length > 3 && (
                <Tag content={`+${user.userProfile.nudges.length - 3}`} />
              )}
            </StyledDashboardProfileCardHelpList>
          ) : (
            <StyledDashboardProfileCardHelpListEmptyState>
              <IlluBulleQuestion />
              <div>Informations pas encore renseignées</div>
            </StyledDashboardProfileCardHelpListEmptyState>
          )}
        </StyledDashboardProfileCardHelps>
      )}
      <StyledDashboardCTAContainer>
        <Button variant="secondary" rounded href="/backoffice/parametres">
          Modifier
        </Button>
      </StyledDashboardCTAContainer>
    </Card>
  );
};
