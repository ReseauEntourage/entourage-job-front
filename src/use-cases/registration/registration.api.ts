import { Api } from '@/src/api';
import { isConflictError } from '@/src/api/axiosErrors';
import { Nudge } from '@/src/api/types';
import { GA_TAGS } from '@/src/constants/tags';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { UserRoleByFlow } from '@/src/features/registration/registration.config';
import { RegistrationData } from '@/src/features/registration/registration.types';
import { getUtmFromLocalStorage } from '@/src/features/registration/registration.utils';
import { UtmParameters } from '@/src/hooks/queryParams/useUTM';
import { gaEventWithUser } from '@/src/lib/gtag';
import { api } from '@/src/store/api/api.slice';
import { assertIsDefined } from '@/src/utils/asserts';
import { PreRegistrationPreferences } from './registration.slice';

// `'GENERIC'` (not `null`) for the non-conflict failure case: RTK Query
// treats a `queryFn` result with a falsy `error` and no `data` as invalid.
export type CreateUserError = 'DUPLICATE_EMAIL' | 'GENERIC';

/**
 * Shared between the auto-submit listener (`registration.listeners.ts`,
 * which triggers the mutation) and `useWizardStepAccount.tsx` (which only
 * needs to observe its result) — RTK Query's documented pattern for this
 * split (same as `refering`'s `REFER_CANDIDATE_FIXED_CACHE_KEY`).
 */
export const CREATE_USER_FIXED_CACHE_KEY = 'createUser';

interface CreateUserArgs {
  data: RegistrationData | null;
  selectedFlow: RegistrationFlow | null;
  invitationId: string | undefined;
  preRegistrationPreferences: PreRegistrationPreferences | null;
}

/** Translates `createUserRequestedSaga`. */
export const registrationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<void, CreateUserArgs>({
      queryFn: async ({
        data,
        selectedFlow,
        invitationId,
        preRegistrationPreferences,
      }) => {
        assertIsDefined(selectedFlow, 'Selected flow must be defined');
        if (!data) {
          console.error('Registration data is not defined');
          return { error: 'GENERIC' as CreateUserError };
        }

        const {
          confirmPassword,
          organizationId,
          companyName,
          companyRole,
          ...restData
        } = data;

        const utmParameters = getUtmFromLocalStorage();

        try {
          const userData = {
            ...restData,
            role: UserRoleByFlow[selectedFlow],
            department: restData.department.value,
            organizationId: organizationId ? organizationId.value : undefined,
            companyName: companyName ? companyName.value : undefined,
            companyRole: companyRole ? companyRole.value : undefined,
            utmSource: utmParameters[UtmParameters.UTM_SOURCE] ?? undefined,
            utmMedium: utmParameters[UtmParameters.UTM_MEDIUM] ?? undefined,
            utmCampaign: utmParameters[UtmParameters.UTM_CAMPAIGN] ?? undefined,
            utmTerm: utmParameters[UtmParameters.UTM_TERM] ?? undefined,
            utmContent: utmParameters[UtmParameters.UTM_CONTENT] ?? undefined,
            utmId: utmParameters[UtmParameters.UTM_ID] ?? undefined,
            invitationId,
            ...(preRegistrationPreferences?.nudgeIds?.length
              ? {
                  nudges: preRegistrationPreferences.nudgeIds.map(
                    (id) => ({ id }) as Nudge
                  ),
                }
              : {}),
            ...(preRegistrationPreferences?.sectorOccupations?.length
              ? {
                  sectorOccupations:
                    preRegistrationPreferences.sectorOccupations,
                }
              : {}),
            ...(preRegistrationPreferences?.currentJob
              ? { currentJob: preRegistrationPreferences.currentJob }
              : {}),
          };
          const { data: createdUser } =
            await Api.postUserRegistration(userData);

          gaEventWithUser(GA_TAGS.INSCRIPTION_COMPTE_CREE.action, {
            userId: createdUser.id,
            zone: createdUser.zone,
            role: createdUser.role,
          });

          return { data: undefined };
        } catch (err) {
          if (isConflictError(err)) {
            return { error: 'DUPLICATE_EMAIL' as CreateUserError };
          }
          console.error('Error during user registration:', err);
          return { error: 'GENERIC' as CreateUserError };
        }
      },
    }),
  }),
});

export const { useCreateUserMutation } = registrationApi;
