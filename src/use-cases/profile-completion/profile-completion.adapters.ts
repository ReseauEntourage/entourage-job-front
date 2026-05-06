import { createRequestAdapter } from 'src/store/utils';

type FetchProfileCompletionError = 'FETCH_FAILED';

export const fetchProfileCompletionAdapter = createRequestAdapter(
  'fetchProfileCompletion'
).withPayloads<void, number, FetchProfileCompletionError | null>();
