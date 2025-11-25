import React, { useMemo } from 'react';
import { EventInfoSummary } from '@/src/components/backoffice/events/EventInfoSummary/EventInfoSummary';
import { EVENT_IMAGES } from '@/src/constants/events';
import { H5 } from '../../../Headings';
import { LegacyImg } from '../../../Images';
import { EntityCard } from '../EntityCard/EntityCard';
import { Event } from 'src/api/types';
import { LucidIcon, Text } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledEventCardContentContainer,
  StyledEventCardParticipation,
  StyledEventCardPicture,
  StyledEventCardPictureContainer,
} from './EventCard.styles';

export type EventCardProps = Pick<
  Event,
  | 'salesForceId'
  | 'name'
  | 'startDate'
  | 'eventType'
  | 'mode'
  | 'meetingLink'
  | 'fullAddress'
  | 'participantsCount'
>;

export function EventCard({
  salesForceId,
  name,
  startDate,
  eventType,
  mode,
  meetingLink,
  fullAddress,
  participantsCount,
}: EventCardProps) {
  // Compute image based on event type
  const image = useMemo(() => {
    return EVENT_IMAGES[eventType] || EVENT_IMAGES.UNKNOWN;
  }, [eventType]);

  const participating = false; // TODO: Replace with real participation status

  return (
    <EntityCard
      href={{
        pathname: `/backoffice/events/[id]`,
        query: { id: salesForceId },
      }}
      onClick={() => {
        gaEvent(GA_TAGS.PAGE_EVENTS_CARTE_CLIC);
      }}
      borderColor={participating ? 'primaryBlue' : undefined}
    >
      <StyledEventCardPictureContainer className="profile-card">
        {/* Picture */}
        <StyledEventCardPicture>
          <LegacyImg src={image} alt={`photo de ${name}`} cover />
        </StyledEventCardPicture>

        {/* Participation status */}
        {participating && (
          <StyledEventCardParticipation>
            <LucidIcon name="Check" size={16} color="white" />
            <Text color="white">Inscrit</Text>
          </StyledEventCardParticipation>
        )}
      </StyledEventCardPictureContainer>
      <StyledEventCardContentContainer>
        <H5 title={name} />
        {/* TODO: Add the targeted roles badges */}

        <EventInfoSummary
          startDate={startDate}
          mode={mode}
          meetingLink={meetingLink}
          fullAddress={fullAddress}
          participantsCount={participantsCount}
          displayParticipants
        />
      </StyledEventCardContentContainer>
    </EntityCard>
  );
}
