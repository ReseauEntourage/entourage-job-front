import { InternalMessage, ProfilesFilters, PublicProfile } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const fetchProfilesAdapter = createRequestAdapter(
  'fetchProfiles'
).withPayloads<ProfilesFilters, PublicProfile[]>();

export const fetchSelectedProfileAdapter = createRequestAdapter(
  'fetchSelectedProfile'
).withPayloads<
  {
    userId: string;
  },
  PublicProfile
>();

export const postInternalMessageAdapter = createRequestAdapter(
  'postInternalMessage'
).withPayloads<InternalMessage>();
