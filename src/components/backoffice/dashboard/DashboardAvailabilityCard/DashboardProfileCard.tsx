import React from 'react';
import { useHelpField } from '../../parametres/useUpdateProfile';
import { Button, Card, ImgProfile, Tag } from 'src/components/utils';
import { H5 } from 'src/components/utils/Headings';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
// import { findConstantFromValue } from 'src/utils';
import {
  StyledDashboardCTAContainer,
  StyledDashboardProfileCardDescription,
  StyledDashboardProfileCardHelpList,
  StyledDashboardProfileCardHelps,
  StyledDashboardProfileCardhelpsTitle,
  StyledDashboardProfileCardPictureName,
} from './DashboardProfileCard.styles';
// import { ProfileCardHelps } from 'src/constants/helps';

export const DashboardProfileCard = () => {
  const user = useAuthenticatedUser();
  const helpField = useHelpField(user.role);
  if (!helpField) return null;
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
            {user.userProfile[helpField].slice(0, 3).map((help, index) => (
              <Tag key={index} content={help.name} />
            ))}
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
