import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, LegacyImg, SimpleLink } from '@/src/components/ui';
import { Spinner } from '@/src/components/ui/Spinner';
import { Text } from '@/src/components/ui/Text';
import { DEPARTMENTS } from '@/src/constants/departements';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useCurrentUserStaffContact } from '@/src/hooks/useCurrentUserStaffContact';
import { fetchStaffContactSelectors } from '@/src/use-cases/current-user';
import {
  StyledStaffContactCompact,
  StyledStaffContactCompactPicture,
  StyledStaffContactContentContainer,
  StyledStaffContactMail,
  StyledStaffContactName,
  StyledStaffContactNameContainer,
  StyledStaffContactPicture,
  StyledStaffContactRole,
  StyledStaffContactText,
} from './StaffContactCard.styles';

interface StaffContactCardProps {
  // 'full' (default): title, photo, role/region, email, generic contact blurb — used
  // standalone (e.g. the dashboard). 'compact': just avatar + name + role, meant to be
  // nested inside another card/screen (e.g. the checkin low-rating final screen).
  variant?: 'full' | 'compact';
}

export const StaffContactCard = ({
  variant = 'full',
}: StaffContactCardProps) => {
  const profile = useCurrentUserProfile();
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
      return deptObj.name === profile?.department;
    })?.region;
  }, [profile?.department]);

  if (variant === 'compact') {
    if (isLoading) {
      return <Spinner />;
    }
    if (!staffContact) {
      return null;
    }
    return (
      <StyledStaffContactCompact>
        <StyledStaffContactCompactPicture>
          <LegacyImg src={staffContact.img} alt={staffContact.name} cover />
        </StyledStaffContactCompactPicture>
        <div>
          <Text weight="bold">{staffContact.name}</Text>
          <Text size="small" color="darkGray">
            Votre contact Entourage
          </Text>
        </div>
      </StyledStaffContactCompact>
    );
  }

  return (
    <Card title="Votre contact Entourage Pro" centerTitle>
      <StyledStaffContactContentContainer>
        {isLoading && <Spinner />}
        {!isLoading && staffContact && (
          <>
            <StyledStaffContactPicture>
              <LegacyImg src={staffContact.img} alt={staffContact.name} cover />
            </StyledStaffContactPicture>
            <StyledStaffContactNameContainer>
              <StyledStaffContactName>
                <Text color="primaryBlue" size="xlarge" weight="semibold">
                  {staffContact.name}
                </Text>
              </StyledStaffContactName>
              <StyledStaffContactRole>
                <Text variant="italic">
                  Référent(e) Entourage Pro {staffContactRegion || ''}
                </Text>
              </StyledStaffContactRole>
            </StyledStaffContactNameContainer>
            <StyledStaffContactMail>
              <Text weight="bold" center>
                <SimpleLink isExternal href={`mailto:${staffContact.email}`}>
                  {staffContact.email}
                </SimpleLink>
              </Text>
            </StyledStaffContactMail>
            <StyledStaffContactText>
              <Text center>
                Vous souhaitez obtenir plus d&apos;informations sur le
                programme, vous rencontrez des difficultés sur la plateforme, ou
                autre demande, contactez-nous&nbsp;!
              </Text>
            </StyledStaffContactText>
          </>
        )}
      </StyledStaffContactContentContainer>
    </Card>
  );
};
