import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { DEPARTMENTS } from '@/src/constants/departements';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserReferral } from '@/src/hooks/useCurrentUserReferral';
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
  const referral = useCurrentUserReferral();

  const referentRegion = useMemo(() => {
    return DEPARTMENTS.find((deptObj) => {
      return deptObj.name === user.userProfile.department;
    })?.region;
  }, [user.userProfile.department]);

  useEffect(() => {
    dispatch(currentUserActions.fetchReferralRequested());
  }, [dispatch]);

  if (!referral) {
    return null;
  }

  return (
    <Card title="Votre contact Entourage Pro" centerTitle>
      <StyledDashboardCardContentContainer>
        <StyledDashboardReferentPicture>
          <LegacyImg src={referral.img} alt={referral.name} cover />
        </StyledDashboardReferentPicture>
        <StyledDashboardReferentNameContainer>
          <StyledDashboardReferentName>
            <H3 color="primaryBlue" title={referral.name} />
          </StyledDashboardReferentName>
          <StyledDashboardReferentRole>
            <Text variant="italic">
              Référent(e) Entourage Pro {referentRegion || ''}
            </Text>
          </StyledDashboardReferentRole>
        </StyledDashboardReferentNameContainer>
        <StyledDashboardReferentMail>
          <Text weight="bold">
            <SimpleLink isExternal href={`mailto:${referral.email}`}>
              {referral.email}
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
