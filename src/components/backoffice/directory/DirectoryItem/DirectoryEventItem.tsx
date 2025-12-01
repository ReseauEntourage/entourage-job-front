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
  startDate,
  eventType,
  mode,
  meetingLink,
  fullAddress,
  registrationCount,
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
      />
    </CardListItem>
  );
}
