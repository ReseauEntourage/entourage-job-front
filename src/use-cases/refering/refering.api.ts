import { Api } from '@/src/api';
import { isConflictError } from '@/src/api/axiosErrors';
import { Nudge } from '@/src/api/types';
import { ReferingStepData } from '@/src/features/backoffice/referer/Refering/Refering.types';
import { flattenReferingData } from '@/src/features/backoffice/referer/Refering/Refering.utils';
import { api } from '@/src/store/api/api.slice';
import { formatCareerPathSentence } from '@/src/utils/Formatting';

// `'GENERIC'` (not `null`) for the non-conflict failure case: RTK Query
// treats a `queryFn` result with a falsy `error` and no `data` as invalid
// (logged as an error and resolved as if unset), so the error value must be
// truthy. Consumers still only special-case `'DUPLICATE_EMAIL'`, same as
// when the generic case was `null`.
export type ReferCandidateError = 'DUPLICATE_EMAIL' | 'GENERIC';

/**
 * Shared between the auto-submit listener (`refering.listeners.ts`, which
 * triggers the mutation) and `useRefering.ts` (which only needs to observe
 * its result) so the hook reflects an invocation it didn't itself trigger —
 * RTK Query's documented pattern for this split.
 */
export const REFER_CANDIDATE_FIXED_CACHE_KEY = 'referCandidate';

/** Translates `referCandidateSagaRequested`. */
export const referingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    referCandidate: builder.mutation<void, ReferingStepData>({
      queryFn: async (data) => {
        const {
          businessSectorId0,
          businessSectorId1,
          occupation0,
          occupation1,
          confirmReferingRules,
          nudgeIds,
          ...flattenedData
        } = flattenReferingData(data);

        try {
          await Api.postUserRefering({
            ...flattenedData,
            sectorOccupations: formatCareerPathSentence({
              businessSectorId0,
              businessSectorId1,
              occupation0,
              occupation1,
            }),
            department: flattenedData.department.value,
            nudges: nudgeIds?.length
              ? nudgeIds.map((id) => ({ id }) as Nudge)
              : undefined,
          });
          return { data: undefined };
        } catch (err) {
          if (isConflictError(err)) {
            return { error: 'DUPLICATE_EMAIL' as ReferCandidateError };
          }
          return { error: 'GENERIC' as ReferCandidateError };
        }
      },
    }),
  }),
});

export const { useReferCandidateMutation } = referingApi;
