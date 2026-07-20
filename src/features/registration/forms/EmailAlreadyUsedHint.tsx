import React from 'react';
import { useSelector } from 'react-redux';
import { SimpleLink } from '@/src/components/ui';
import { ReduxRequestEvents } from '@/src/constants';
import {
  createUserSelectors,
  selectCreateUserError,
} from '@/src/use-cases/registration';

export function EmailAlreadyUsedInlineLink() {
  const createUserStatus = useSelector(
    createUserSelectors.selectCreateUserStatus
  );
  const createUserError = useSelector(selectCreateUserError);

  if (
    createUserStatus !== ReduxRequestEvents.FAILED ||
    createUserError !== 'DUPLICATE_EMAIL'
  ) {
    return null;
  }

  return (
    <>
      {' '}
      vous pouvez aussi <SimpleLink href="/login">vous connecter</SimpleLink>.
    </>
  );
}
