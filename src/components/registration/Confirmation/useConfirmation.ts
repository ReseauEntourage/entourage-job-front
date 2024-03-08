import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  registrationActions,
  selectRegistrationConfirmationStepContent,
} from 'src/use-cases/registration';

export function useConfirmation() {
  const dispatch = useDispatch();
  const pageContent = useSelector(selectRegistrationConfirmationStepContent);

  useEffect(() => {
    return () => {
      dispatch(registrationActions.resetRegistrationData());
      dispatch(registrationActions.createUserReset());
    };
  }, [dispatch]);

  return { pageContent };
}
