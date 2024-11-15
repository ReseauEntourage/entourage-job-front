import { createRequestAdapter } from 'src/store/utils';

export type ReferCandidateError = 'DUPLICATE_EMAIL';

export const referCandidateAdapter = createRequestAdapter(
  'referCandidate'
).withPayloads<void, void, { error: ReferCandidateError } | null>();
