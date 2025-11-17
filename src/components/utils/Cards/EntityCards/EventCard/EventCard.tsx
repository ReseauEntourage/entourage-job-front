import moment from 'moment';
import 'moment/locale/fr';
import React, { useMemo } from 'react';
import { EVENT_IMAGES, EventMode } from '@/src/constants/events';
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
  StyledEventInfoElement,
  StyledEventInfoElementContainer,
  StyledSeparator,
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

        <StyledEventInfoElementContainer>
          {/* Date start */}
          <StyledEventInfoElement>
            <LucidIcon name="Calendar" size={20} />
            <Text>Le {moment(startDate).locale('fr').format('LLL')}</Text>
          </StyledEventInfoElement>

          {/* IRL Location */}
          {mode === EventMode.IN_PERSON && fullAddress && (
            <StyledEventInfoElement>
              <LucidIcon name="MapPin" size={20} />
              <Text>{fullAddress}</Text>
            </StyledEventInfoElement>
          )}

          {/* Online Location */}
          {mode === EventMode.ONLINE && meetingLink && (
            <StyledEventInfoElement>
              <LucidIcon name="Laptop" size={20} />
              <Text>En visio</Text>
            </StyledEventInfoElement>
          )}
        </StyledEventInfoElementContainer>

        <StyledSeparator />
        {/* Participants count */}
        <StyledEventInfoElement>
          <LucidIcon name="Users" size={20} />
          {participantsCount === 0 ? (
            <Text>Aucun participant</Text>
          ) : (
            <Text>
              {participantsCount} participant{participantsCount > 1 ? 's' : ''}
            </Text>
          )}
        </StyledEventInfoElement>
      </StyledEventCardContentContainer>
    </EntityCard>
  );
}
