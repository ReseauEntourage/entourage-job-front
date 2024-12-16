import React, { useMemo } from 'react';
import { StyledDashboardCardContentContainer } from '../Dashboard.styles';
import { Card, Img, SimpleLink } from 'src/components/utils';
import { H3 } from 'src/components/utils/Headings';
import { Text } from 'src/components/utils/Text';
import { DEPARTMENTS } from 'src/constants/departements';
import { Referents } from 'src/constants/referents';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';

import {
  StyledDashboardReferentMail,
  StyledDashboardReferentName,
  StyledDashboardReferentNameContainer,
  StyledDashboardReferentPicture,
  StyledDashboardReferentRole,
  StyledDashboardReferentText,
} from './DashboardReferentCard.styles';

export const DashboardReferentCard = () => {
  const user = useAuthenticatedUser();

  const referent = useMemo(() => {
    return Referents[user.zone];
  }, [user.zone]);

  const referentRegion = useMemo(() => {
    return DEPARTMENTS.find((deptObj) => {
      return deptObj.name === user.userProfile.department;
    })?.region;
  }, [user.userProfile.department]);

  return (
    <Card title="Votre contact Entourage Pro" centerTitle>
      <StyledDashboardCardContentContainer>
        <StyledDashboardReferentPicture>
          <Img
            src={`/static/img/referents/${referent.img}`}
            alt={referent.name}
            cover
          />
        </StyledDashboardReferentPicture>
        <StyledDashboardReferentNameContainer>
          <StyledDashboardReferentName>
            <H3 color="primaryBlue" title={referent.name} />
          </StyledDashboardReferentName>
          <StyledDashboardReferentRole>
            <Text variant="italic">
              Référent(e) Entourage Pro {referentRegion || ''}
            </Text>
          </StyledDashboardReferentRole>
        </StyledDashboardReferentNameContainer>
        <StyledDashboardReferentMail>
          <Text weight="bold">
            <SimpleLink isExternal href={`mailto:${referent.mail}`}>
              {referent.mail}
            </SimpleLink>
          </Text>
        </StyledDashboardReferentMail>
        <StyledDashboardReferentText>
          <Text center>
            Vous souhaitez obtenir plus d&apos;informations sur le programme,
            vous rencontrez des difficultés sur la plateforme, ou autre demande,
            contactez-nous&nbsp;!
          </Text>
        </StyledDashboardReferentText>
      </StyledDashboardCardContentContainer>
    </Card>
  );
};
