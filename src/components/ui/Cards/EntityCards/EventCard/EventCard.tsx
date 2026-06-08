import React, { useMemo } from 'react';
import {
  Badge,
  BadgeVariant,
  LucidIcon,
  Text,
  Tooltip,
} from '@/src/components/ui';
import { EVENT_IMAGES, PublicSensibilise } from '@/src/constants/events';
import { EventInfoSummary } from '@/src/features/backoffice/events/EventInfoSummary/EventInfoSummary';
import { H5 } from '../../../Headings';
import { LegacyImg } from '../../../Images';
import { EntityCard } from '../EntityCard/EntityCard';
import { Event } from 'src/api/types';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledEventCardContentContainer,
  StyledEventCardOverlay,
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
  | 'registrationCount'
  | 'isParticipating'
  | 'publicSensibilise'
>;

export function EventCard({
  salesForceId,
  name,
  startDate,
  eventType,
  mode,
  meetingLink,
  fullAddress,
  registrationCount,
  isParticipating,
  publicSensibilise,
}: EventCardProps) {
  // Compute image based on event type
  const image = useMemo(() => {
    return EVENT_IMAGES[eventType] || EVENT_IMAGES.UNKNOWN;
  }, [eventType]);

  return (
    <EntityCard
      href={{
        pathname: `/backoffice/events/[id]`,
        query: { id: salesForceId },
      }}
      onClick={() => {
        gaEvent(GA_TAGS.PAGE_EVENTS_CARTE_CLIC);
      }}
      borderColor={isParticipating ? 'primaryBlue' : undefined}
    >
      <StyledEventCardPictureContainer className="profile-card">
        {/* Picture */}
        <StyledEventCardPicture>
          <LegacyImg src={image} alt={`photo de ${name}`} cover />
        </StyledEventCardPicture>

        {/* Participation status */}

        <StyledEventCardOverlay>
          {isParticipating && (
            <Tooltip content="Vous êtes inscrit à cet événement">
              <Badge variant={BadgeVariant.Primary} borderRadius="large">
                <LucidIcon name="Check" size={16} color="white" />
                <Text color="white">Inscrit</Text>
              </Badge>
            </Tooltip>
          )}
          {publicSensibilise?.includes(PublicSensibilise.YOUNG_PUBLIC) && (
            <Tooltip content="Événement destiné aux jeunes">
              <Badge variant={BadgeVariant.Orange} borderRadius="large">
                100% jeunes
              </Badge>
            </Tooltip>
          )}
        </StyledEventCardOverlay>
      </StyledEventCardPictureContainer>
      <StyledEventCardContentContainer>
        <H5 title={name} />
        <EventInfoSummary
          startDate={startDate}
          mode={mode}
          meetingLink={meetingLink}
          fullAddress={fullAddress}
          registrationCount={registrationCount}
          displayParticipants
          isParticipating={isParticipating}
          compact
        />
      </StyledEventCardContentContainer>
    </EntityCard>
  );
}
