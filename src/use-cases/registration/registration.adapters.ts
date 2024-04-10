import { createRequestAdapter } from 'src/store/utils';

export type CreateUserError = 'DUPLICATE_EMAIL';

export const createUserAdapter = createRequestAdapter(
  'createUser'
).withPayloads<void, void, { error: CreateUserError } | null>();
