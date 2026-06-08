import React from 'react';
import { Event } from '@/src/api/types';
import { Badge, BadgeVariant, Section } from '@/src/components/ui';
import { BackLink } from '@/src/components/ui/BackLink';
import { H3 } from '@/src/components/ui/Headings';
import { ImgEvent } from '@/src/components/ui/Images/ImgEvent/ImgEvent';
import { PublicSensibilise } from '@/src/constants/events';
import { EventParticipateButton } from '@/src/features/backoffice/events/Event/EventParticipateButton/EventParticipateButton';
import { EventInfoSummary } from '@/src/features/backoffice/events/EventInfoSummary/EventInfoSummary';
import { useIsMobile } from '@/src/hooks/utils';
import {
  StyledHeader,
  StyledHeaderContent,
  StyledHeaderInfoContainer,
  StyledHeaderPictureContainer,
  StyledTitleAndBadges,
} from './HeaderEvent.styles';

type HeaderEventProps = Pick<
  Event,
  | 'salesForceId'
  | 'name'
  | 'eventType'
  | 'startDate'
  | 'mode'
  | 'meetingLink'
  | 'fullAddress'
  | 'registrationCount'
  | 'isParticipating'
  | 'publicSensibilise'
>;

const EVENT_PICTURE_SIZE = {
  desktop: {
    width: 150,
    height: 150,
  },
  mobile: {
    width: 120,
    height: 120,
  },
};

export const HeaderEvent = ({
  salesForceId,
  name,
  eventType,
  mode,
  meetingLink,
  startDate,
  fullAddress,
  registrationCount,
  isParticipating,
  publicSensibilise,
}: HeaderEventProps) => {
  const isMobile = useIsMobile();
  const imageSize = EVENT_PICTURE_SIZE[isMobile ? 'mobile' : 'desktop'];
  return (
    <StyledHeader>
      <Section className="custom-page">
        <BackLink label="Retour" />
        <StyledHeaderContent>
          <StyledHeaderPictureContainer>
            <ImgEvent
              eventType={eventType}
              width={imageSize.width}
              height={imageSize.height}
              alt={name}
            />
          </StyledHeaderPictureContainer>
          <StyledHeaderInfoContainer>
            <StyledTitleAndBadges>
              <H3 title={name} />
              {publicSensibilise?.includes(PublicSensibilise.YOUNG_PUBLIC) && (
                <Badge
                  variant={BadgeVariant.ExtraLightPurple}
                  borderRadius="large"
                >
                  100% jeunes
                </Badge>
              )}
            </StyledTitleAndBadges>
            <EventInfoSummary
              startDate={startDate}
              mode={mode}
              meetingLink={meetingLink}
              fullAddress={fullAddress}
              registrationCount={registrationCount}
              isParticipating={isParticipating}
            />
            {isMobile && (
              <EventParticipateButton
                eventSalesForceId={salesForceId}
                isParticipating={isParticipating}
              />
            )}
          </StyledHeaderInfoContainer>
        </StyledHeaderContent>
      </Section>
    </StyledHeader>
  );
};
