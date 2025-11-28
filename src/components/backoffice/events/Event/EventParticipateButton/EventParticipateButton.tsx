import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonProps, LucidIcon } from '@/src/components/utils';
import {
  eventsActions,
  updateUserParticipationSelectors,
} from '@/src/use-cases/events';

export interface EventParticipateButtonProps extends Partial<ButtonProps> {
  eventSalesForceId: string;
  isParticipating: boolean;
}

export const EventParticipateButton = ({
  eventSalesForceId,
  isParticipating,
}: EventParticipateButtonProps) => {
  const isUpdateUserParticipationRequested = useSelector(
    updateUserParticipationSelectors.selectIsUpdateUserParticipationRequested
  );

  const isLoading = isUpdateUserParticipationRequested;

  const dispatch = useDispatch();
  const requestParticipation = () => {
    dispatch(
      eventsActions.updateUserParticipationRequested({
        eventSalesForceId,
        isParticipating: !isParticipating,
      })
    );
  };

  const defaultTextContent = useMemo(() => {
    return isParticipating ? 'Se désinscrire' : "Participer à l'événement";
  }, [isParticipating]);

  const loadingTextContent = isParticipating
    ? 'Désinscription en cours...'
    : 'Inscription en cours...';

  return (
    <Button onClick={requestParticipation}>
      {isLoading ? (
        <>
          <LucidIcon name="Loader" spin />
          &nbsp;{loadingTextContent}
        </>
      ) : (
        defaultTextContent
      )}
    </Button>
  );
};
