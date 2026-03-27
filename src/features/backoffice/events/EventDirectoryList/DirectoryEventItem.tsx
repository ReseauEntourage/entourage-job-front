import React from 'react';
import { CardListItem } from '@/src/components/ui/CardList';
import {
  EventCard,
  EventCardProps,
} from '@/src/components/ui/Cards/EntityCards/EventCard/EventCard';

export type DirectoryEventItemProps = EventCardProps;

export function DirectoryEventItem({
  salesForceId,
  name,
  startDate,
  eventType,
  mode,
  meetingLink,
  fullAddress,
  registrationCount,
  isParticipating,
}: DirectoryEventItemProps) {
  return (
    <CardListItem dataTestId={salesForceId}>
      <EventCard
        salesForceId={salesForceId}
        name={name}
        startDate={startDate}
        eventType={eventType}
        mode={mode}
        meetingLink={meetingLink}
        fullAddress={fullAddress}
        registrationCount={registrationCount}
        isParticipating={isParticipating}
      />
    </CardListItem>
  );
}
