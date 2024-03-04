import { User } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

// TODO rename and put right types
export const createUserAdapter = createRequestAdapter(
  'createUser'
).withPayloads<User, User>();
