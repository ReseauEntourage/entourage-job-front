import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { EventDirectory } from '@/src/features/backoffice/events/EventDirectory/EventDirectory';

const EventList = () => {
  return (
    <LayoutBackOffice title="Liste des événements">
      <EventDirectory />
    </LayoutBackOffice>
  );
};

export default EventList;
