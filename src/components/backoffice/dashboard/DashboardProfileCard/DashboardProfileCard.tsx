import React from 'react';
import { useContextualRole } from '../../useContextualRole';
import { useHelpField } from 'src/components/backoffice/parametres/useUpdateProfile';
import { Button, Card, ImgProfile, Tag } from 'src/components/utils';
import { H5 } from 'src/components/utils/Headings';
import { ProfileHelps } from 'src/constants/helps';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  StyledDashboardCTAContainer,
  StyledDashboardProfileCardDescription,
  StyledDashboardProfileCardHelpList,
  StyledDashboardProfileCardHelps,
  StyledDashboardProfileCardhelpsTitle,
  StyledDashboardProfileCardPictureName,
} from './DashboardProfileCard.styles';

export const DashboardProfileCard = () => {
  const user = useAuthenticatedUser();
  const helpField = useHelpField(user.role);
  const { contextualRole } = useContextualRole(user.role);
  if (!helpField || !contextualRole) return null;
  return (
    <Card>
      <StyledDashboardProfileCardPictureName>
        <ImgProfile user={user} size={69} />
        <div>
          <H5
            title={`${user.firstName} ${user.lastName
              .charAt(0)
              .toUpperCase()}.`}
          />
          {user.userProfile.department && <p>{user.userProfile.department}</p>}
        </div>
      </StyledDashboardProfileCardPictureName>
      {user.userProfile.description && (
        <StyledDashboardProfileCardDescription>
          {user.userProfile.description}
        </StyledDashboardProfileCardDescription>
      )}
      {user.userProfile[helpField].length > 0 && (
        <StyledDashboardProfileCardHelps>
          <StyledDashboardProfileCardhelpsTitle>
            Mes coups de pouce
          </StyledDashboardProfileCardhelpsTitle>
          <StyledDashboardProfileCardHelpList>
            {user.userProfile[helpField].slice(0, 3).map((help, index) => {
              const helpDetails = ProfileHelps.find(
                (helpConstant) => helpConstant.value === help.name
              );
              if (helpDetails) {
                const tagContent = helpDetails.shortTitle[contextualRole];
                return <Tag key={index} content={tagContent} />;
              }
              return null;
            })}
            {user.userProfile[helpField].length > 3 && (
              <Tag content={`+${user.userProfile[helpField].length - 3}`} />
            )}
          </StyledDashboardProfileCardHelpList>
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
