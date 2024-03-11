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
    dispatch(registrationActions.setRegistrationStep(null));

    return () => {
      dispatch(registrationActions.resetRegistrationData());
    };
  }, [dispatch]);

  return { pageContent };
}
