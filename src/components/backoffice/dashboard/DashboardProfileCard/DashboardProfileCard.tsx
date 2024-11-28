import React from 'react';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { useContextualRole } from '../../useContextualRole';
import { useHelpField } from 'src/components/backoffice/parametres/useUpdateProfile';
import {
  Button,
  Card,
  ImgProfile,
  SimpleLink,
  Tag,
  Text,
} from 'src/components/utils';
import { ProfileHelps } from 'src/constants/helps';
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
  const helpField = useHelpField(user.role);
  const { contextualRole } = useContextualRole(user.role);

  // Had to do it it two steps for the linter to be happy
  const userHelpField = helpField ? user.userProfile[helpField] : null;

  return (
    <Card>
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

      {userHelpField && (
        <StyledDashboardProfileCardHelps>
          <StyledDashboardProfileCardhelpsTitle>
            Mes {contextualRole === USER_ROLES.CANDIDATE && 'besoins de '} coups
            de pouce
          </StyledDashboardProfileCardhelpsTitle>
          {userHelpField.length > 0 ? (
            <StyledDashboardProfileCardHelpList>
              {userHelpField.slice(0, 3).map((help, index) => {
                const helpDetails = ProfileHelps.find(
                  (helpConstant) => helpConstant.value === help.name
                );
                if (helpDetails) {
                  const tagContent = helpDetails.shortTitle[contextualRole];
                  return <Tag key={index} content={tagContent} />;
                }
                return null;
              })}
              {userHelpField.length > 3 && (
                <Tag content={`+${userHelpField.length - 3}`} />
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
