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
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  StyledDashboardCTAContainer,
  StyledDashboardProfileCardDescription,
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
      {user.userProfile.description && (
        <StyledDashboardProfileCardDescription>
          {user.userProfile.description}
        </StyledDashboardProfileCardDescription>
      )}

      {user.userProfile.userProfileNudges && (
        <StyledDashboardProfileCardHelps>
          <StyledDashboardProfileCardhelpsTitle>
            Mes {contextualRole === USER_ROLES.CANDIDATE && 'besoins de '} coups
            de pouce
          </StyledDashboardProfileCardhelpsTitle>
          {user.userProfile.userProfileNudges.length > 0 ? (
            <StyledDashboardProfileCardHelpList>
              {user.userProfile.userProfileNudges
                .slice(0, 3)
                .map((userProfileNudge, index) => {
                  const nudgeDetails = ProfileHelps.find(
                    (nudgeConstant) =>
                      nudgeConstant.value === userProfileNudge?.nudge?.value
                  );
                  if (nudgeDetails) {
                    const tagContent = nudgeDetails.shortTitle[contextualRole];
                    return <Tag key={index} content={tagContent} />;
                  }
                  return null;
                })}
              {user.userProfile.userProfileNudges.length > 3 && (
                <Tag
                  content={`+${user.userProfile.userProfileNudges.length - 3}`}
                />
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
        <Button style="custom-secondary" href="/backoffice/parametres">
          Modifier
        </Button>
      </StyledDashboardCTAContainer>
    </Card>
  );
};
