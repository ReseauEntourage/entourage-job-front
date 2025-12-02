import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { DEPARTMENTS } from '@/src/constants/departements';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserStaffContact } from '@/src/hooks/useCurrentUserStaffContact';
import { currentUserActions } from '@/src/use-cases/current-user';
import { StyledDashboardCardContentContainer } from '../Dashboard.styles';
import { Card, LegacyImg, SimpleLink } from 'src/components/utils';
import { H3 } from 'src/components/utils/Headings';
import { Text } from 'src/components/utils/Text';

import {
  StyledDashboardReferentMail,
  StyledDashboardReferentName,
  StyledDashboardReferentNameContainer,
  StyledDashboardReferentPicture,
  StyledDashboardReferentRole,
  StyledDashboardReferentText,
} from './DashboardReferentCard.styles';

export const DashboardReferentCard = () => {
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
  const staffContact = useCurrentUserStaffContact();

  const staffContactRegion = useMemo(() => {
    return DEPARTMENTS.find((deptObj) => {
      return deptObj.name === user.userProfile.department;
    })?.region;
  }, [user.userProfile.department]);

  useEffect(() => {
    dispatch(currentUserActions.fetchStaffContactRequested());
  }, [dispatch]);

  if (!staffContact) {
    return null;
  }

  return (
    <Card title="Votre contact Entourage Pro" centerTitle>
      <StyledDashboardCardContentContainer>
        <StyledDashboardReferentPicture>
          <LegacyImg src={staffContact.img} alt={staffContact.name} cover />
        </StyledDashboardReferentPicture>
        <StyledDashboardReferentNameContainer>
          <StyledDashboardReferentName>
            <H3 color="primaryBlue" title={staffContact.name} />
          </StyledDashboardReferentName>
          <StyledDashboardReferentRole>
            <Text variant="italic">
              Référent(e) Entourage Pro {staffContactRegion || ''}
            </Text>
          </StyledDashboardReferentRole>
        </StyledDashboardReferentNameContainer>
        <StyledDashboardReferentMail>
          <Text weight="bold">
            <SimpleLink isExternal href={`mailto:${staffContact.email}`}>
              {staffContact.email}
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
