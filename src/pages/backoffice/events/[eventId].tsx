import React from 'react';
import { useSelector } from 'react-redux';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { Event } from '@/src/features/backoffice/events/Event/Event';
import { useSelectedEvent } from '@/src/features/backoffice/events/Event/useSelectedEvent';
import { fetchSelectedEventSelectors } from '@/src/use-cases/events';

const PageEvent = () => {
  const { selectedEvent } = useSelectedEvent();
  const isFetchEventRequested = useSelector(
    fetchSelectedEventSelectors.selectIsFetchSelectedEventRequested
  );

  return (
    <LayoutBackOffice
      title={
        selectedEvent
          ? `Événement - ${selectedEvent.name}`
          : 'Événement - Chargement...'
      }
    >
      {selectedEvent && !isFetchEventRequested ? <Event /> : <LoadingScreen />}
    </LayoutBackOffice>
  );
};

export default PageEvent;
