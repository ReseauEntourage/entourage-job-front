import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, LegacyImg, SimpleLink } from '@/src/components/ui';
import { H3 } from '@/src/components/ui/Headings';
import { Spinner } from '@/src/components/ui/Spinner';
import { Text } from '@/src/components/ui/Text';
import { DEPARTMENTS } from '@/src/constants/departements';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserStaffContact } from '@/src/hooks/useCurrentUserStaffContact';
import {
  currentUserActions,
  fetchStaffContactSelectors,
} from '@/src/use-cases/current-user';
import { StyledDashboardCardContentContainer } from '../Dashboard.styles';

import {
  StyledDashboardStaffContactMail,
  StyledDashboardStaffContactName,
  StyledDashboardStaffContactNameContainer,
  StyledDashboardStaffContactPicture,
  StyledDashboardStaffContactRole,
  StyledDashboardStaffContactText,
} from './DashboardStaffContactCard.styles';

export const DashboardStaffContactCard = () => {
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
  const staffContact = useCurrentUserStaffContact();

  const isFetchStaffContactIdle = useSelector(
    fetchStaffContactSelectors.selectIsFetchStaffContactIdle
  );

  const isFetchStaffContactRequested = useSelector(
    fetchStaffContactSelectors.selectIsFetchStaffContactRequested
  );

  const isLoading = isFetchStaffContactIdle || isFetchStaffContactRequested;

  const staffContactRegion = useMemo(() => {
    return DEPARTMENTS.find((deptObj) => {
      return deptObj.name === user.userProfile.department;
    })?.region;
  }, [user.userProfile.department]);

  useEffect(() => {
    dispatch(currentUserActions.fetchStaffContactRequested());
  }, [dispatch]);

  return (
    <Card title="Votre contact Entourage Pro" centerTitle>
      <StyledDashboardCardContentContainer>
        {isLoading && <Spinner />}
        {!isLoading && staffContact && (
          <>
            <StyledDashboardStaffContactPicture>
              <LegacyImg src={staffContact.img} alt={staffContact.name} cover />
            </StyledDashboardStaffContactPicture>
            <StyledDashboardStaffContactNameContainer>
              <StyledDashboardStaffContactName>
                <H3 color="primaryBlue" title={staffContact.name} />
              </StyledDashboardStaffContactName>
              <StyledDashboardStaffContactRole>
                <Text variant="italic">
                  Référent(e) Entourage Pro {staffContactRegion || ''}
                </Text>
              </StyledDashboardStaffContactRole>
            </StyledDashboardStaffContactNameContainer>
            <StyledDashboardStaffContactMail>
              <Text weight="bold">
                <SimpleLink isExternal href={`mailto:${staffContact.email}`}>
                  {staffContact.email}
                </SimpleLink>
              </Text>
            </StyledDashboardStaffContactMail>
            <StyledDashboardStaffContactText>
              <Text center>
                Vous souhaitez obtenir plus d&apos;informations sur le
                programme, vous rencontrez des difficultés sur la plateforme, ou
                autre demande, contactez-nous&nbsp;!
              </Text>
            </StyledDashboardStaffContactText>
          </>
        )}
      </StyledDashboardCardContentContainer>
    </Card>
  );
};
