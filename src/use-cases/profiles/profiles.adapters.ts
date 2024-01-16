import { PublicProfile } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const fetchProfilesListAdapter = createRequestAdapter(
  'fetchProfilesList'
).withPayloads<void, PublicProfile[]>();

export const fetchSelectedProfileAdapter = createRequestAdapter(
  'fetchSelectedProfile'
).withPayloads<
  {
    userId: string;
  },
  PublicProfile
>();
