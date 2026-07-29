import React from 'react';
import { SimpleLink } from '@/src/components/ui';
import {
  CREATE_USER_FIXED_CACHE_KEY,
  useCreateUserMutation,
} from '@/src/use-cases/registration';

export function EmailAlreadyUsedInlineLink() {
  const [, { isError, error }] = useCreateUserMutation({
    fixedCacheKey: CREATE_USER_FIXED_CACHE_KEY,
  });

  if (!isError || error !== 'DUPLICATE_EMAIL') {
    return null;
  }

  return (
    <>
      {' '}
      vous pouvez aussi <SimpleLink href="/login">vous connecter</SimpleLink>.
    </>
  );
}
