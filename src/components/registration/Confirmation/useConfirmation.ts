import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { registrationActions } from '@/src/use-cases/registration';
import { RegistrationFlow } from '../flows/flows.types';
import { LastStepContent } from '../registration.config';

export function useConfirmation() {
  const dispatch = useDispatch();
  const flow = useSearchParams().get('flow') as RegistrationFlow;
  const pageContent = LastStepContent[flow];

  useEffect(() => {
    dispatch(registrationActions.resetRegistrationData());
  }, [dispatch]);

  return { pageContent };
}
