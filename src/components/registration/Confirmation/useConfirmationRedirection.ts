import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { REGISTRATION_FIRST_STEP } from '../Registration.types';
import { selectRegistrationData } from 'src/use-cases/registration';

export function useConfirmationRedirection() {
  const { replace } = useRouter();
  const dispatch = useDispatch();

  const data = useSelector(selectRegistrationData);

  const shouldRedirect = _.isEmpty(data);

  useEffect(() => {
    if (shouldRedirect) {
      replace(`/inscription/${REGISTRATION_FIRST_STEP}`);
    }
  }, [dispatch, replace, shouldRedirect]);

  return { isLoading: shouldRedirect };
}
