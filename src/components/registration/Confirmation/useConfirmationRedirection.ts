import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { REGISTRATION_FIRST_STEP } from '../Registration.types';
import { selectIsEmptyRegistrationData } from 'src/use-cases/registration';

export function useConfirmationRedirection() {
  const { replace } = useRouter();
  const dispatch = useDispatch();

  const isEmptyRegistrationData = useSelector(selectIsEmptyRegistrationData);

  useEffect(() => {
    if (isEmptyRegistrationData) {
      replace(`/inscription/${REGISTRATION_FIRST_STEP}`);
    }
  }, [dispatch, replace, isEmptyRegistrationData]);

  return { isLoading: isEmptyRegistrationData };
}
