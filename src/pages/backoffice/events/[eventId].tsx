import React from 'react';
import { useSelector } from 'react-redux';
import { Event } from '@/src/components/backoffice/events/Event/Event';
import { useSelectedEvent } from '@/src/components/backoffice/events/Event/useSelectedEvent';
import { fetchSelectedEventSelectors } from '@/src/use-cases/events';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';

const PageEvent = () => {
  const { selectedEvent } = useSelectedEvent();
  const isFetchEventRequested = useSelector(
    fetchSelectedEventSelectors.selectIsFetchSelectedEventRequested
  );

  return (
    <LayoutBackOffice
      title={
        selectedEvent
          ? `Evenement - ${selectedEvent.name}`
          : 'Evenement - Chargement...'
      }
    >
      {selectedEvent && !isFetchEventRequested ? <Event /> : <LoadingScreen />}
    </LayoutBackOffice>
  );
};

export default PageEvent;
