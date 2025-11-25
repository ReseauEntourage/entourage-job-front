import React from 'react';
import { HeaderEvent } from '@/src/components/headers/HeaderEvent/HeaderEvent';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../../Backoffice.styles';
import { Section } from 'src/components/utils';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledLeftColumn, StyledRightColumn } from './Event.styles';
import { EventActions } from './EventActions/EventActions';
import { EventDescription } from './EventDescription/EventDescription';
import { EventHighlights } from './EventHighlights/EventHighlights';
import { EventInvitationToAction } from './EventInvitationToAction/EventInvitationToAction';
import { EventParticipants } from './EventParticipants/EventParticipants';
import { EventSequences } from './EventSequences/EventSequences';
import { useSelectSelectedEvent } from './useSelectedEvent';

export const Event = () => {
  const isDesktop = useIsDesktop();
  const selectedEvent = useSelectSelectedEvent();

  return (
    <StyledBackofficeBackground>
      <HeaderEvent
        name={selectedEvent.name}
        eventType={selectedEvent.eventType}
        mode={selectedEvent.mode}
        meetingLink={selectedEvent.meetingLink}
        startDate={selectedEvent.startDate}
        fullAddress={selectedEvent.fullAddress}
        participantsCount={selectedEvent.participantsCount}
      />
      <Section className="custom-page">
        <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledLeftColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <EventDescription description={selectedEvent.description} />
            <EventHighlights
              format={selectedEvent.format}
              duration={selectedEvent.duration}
              goal={selectedEvent.goal}
              audience={selectedEvent.audience}
            />
            <EventSequences sequences={selectedEvent.sequences} />
            <EventInvitationToAction
              name={selectedEvent.name}
              salesForceId={selectedEvent.salesForceId}
              description={selectedEvent.description}
            />
          </StyledLeftColumn>
          <StyledRightColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <EventActions />
            <EventParticipants />
          </StyledRightColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
