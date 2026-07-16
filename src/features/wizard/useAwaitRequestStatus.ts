import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import { ReduxRequestStatus } from '@/src/features/wizard/resolveWizardPhase';

const isSettled = (status: ReduxRequestStatus) =>
  status === ReduxRequestEvents.SUCCEEDED ||
  status === ReduxRequestEvents.FAILED;

// useAwaitRequestStatus - Remplace les `waitFor*` artisanaux basés sur
// store.getState()/store.subscribe() par un abonnement idiomatique via useSelector.
// Retourne une fonction qui résout dès que le statut passe à SUCCEEDED/FAILED — la
// promesse résout immédiatement si le statut est déjà réglé à l'appel.
export const useAwaitRequestStatus = <TState>(
  selector: (state: TState) => ReduxRequestStatus
): (() => Promise<ReduxRequestStatus>) => {
  const status = useSelector(selector);
  const resolversRef = useRef<((status: ReduxRequestStatus) => void)[]>([]);

  useEffect(() => {
    if (!isSettled(status)) {
      return;
    }
    const resolvers = resolversRef.current;
    resolversRef.current = [];
    resolvers.forEach((resolve) => resolve(status));
  }, [status]);

  return useCallback((): Promise<ReduxRequestStatus> => {
    if (isSettled(status)) {
      return Promise.resolve(status);
    }
    return new Promise((resolve) => {
      resolversRef.current.push(resolve);
    });
  }, [status]);
};
