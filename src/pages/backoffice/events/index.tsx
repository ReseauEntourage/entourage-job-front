import React from 'react';
import { EventDirectory } from '@/src/components/backoffice/events/EventDirectory/EventDirectory';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';

const EventList = () => {
  return (
    <LayoutBackOffice title="Liste des événements">
      <EventDirectory />
    </LayoutBackOffice>
  );
};

export default EventList;
