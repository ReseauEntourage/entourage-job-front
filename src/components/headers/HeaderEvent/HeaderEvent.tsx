import React from 'react';
import { Event } from '@/src/api/types';
import { useIsMobile } from '@/src/hooks/utils';
import { EventParticipateButton } from '../../backoffice/events/Event/EventParticipateButton/EventParticipateButton';
import { EventInfoSummary } from '../../backoffice/events/EventInfoSummary/EventInfoSummary';
import { Section } from '../../utils';
import { BackLink } from '../../utils/BackLink';
import { H3 } from '../../utils/Headings';
import { ImgEvent } from '../../utils/Images/ImgEvent/ImgEvent';
import {
  StyledHeader,
  StyledHeaderContent,
  StyledHeaderInfoContainer,
  StyledHeaderPictureContainer,
} from './HeaderEvent.styles';

export type HeaderEventProps = Pick<
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
>;

export const EVENT_PICTURE_SIZE = {
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
            <H3 title={name} />
            <EventInfoSummary
              startDate={startDate}
              mode={mode}
              meetingLink={meetingLink}
              fullAddress={fullAddress}
              registrationCount={registrationCount}
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
