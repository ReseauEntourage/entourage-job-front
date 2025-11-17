import React from 'react';
import {
  EventCard,
  EventCardProps,
} from '@/src/components/utils/Cards/EntityCards/EventCard/EventCard';
import { CardListItem } from 'src/components/utils/CardList';

export type DirectoryEventItemProps = EventCardProps;

export function DirectoryEventItem({
  salesForceId,
  name,
  description,
  startDate,
  endDate,
  eventType,
  mode,
  meetingLink,
  fullAddress,
  duration,
  format,
  goal,
  audience,
  sequences,
  participantsCount,
}: DirectoryEventItemProps) {
  return (
    <CardListItem dataTestId={salesForceId}>
      <EventCard
        salesForceId={salesForceId}
        name={name}
        description={description}
        startDate={startDate}
        endDate={endDate}
        eventType={eventType}
        mode={mode}
        meetingLink={meetingLink}
        fullAddress={fullAddress}
        duration={duration}
        format={format}
        goal={goal}
        audience={audience}
        sequences={sequences}
        participantsCount={participantsCount}
      />
    </CardListItem>
  );
}
