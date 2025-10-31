import { call, put, select, takeLatest } from 'typed-redux-saga';
import { Nudge } from '@/src/api/types';
import { UserRoleByFlow } from '@/src/components/registration/registration.config';
import { getUtmFromLocalStorage } from '@/src/components/registration/registration.utils';
import { UtmParameters } from '@/src/hooks/queryParams/useUTM';
import { assertIsDefined } from '@/src/utils/asserts';
import { Api } from 'src/api';
import { isConflictError } from 'src/api/axiosErrors';
import { formatCareerPathSentence } from 'src/utils';
import { asyncTimeout } from 'src/utils/asyncTimeout';
import {
  selectDefinedRegistrationSelectedFlow,
  selectInvitationId,
  selectRegistrationData,
  selectRegistrationIsEnded,
} from './registration.selectors';
import { slice } from './registration.slice';

const {
  createUserSucceeded,
  createUserRequested,
  createUserFailed,
  setRegistrationIsLoading,
  moveForwardInRegistration,
  resetRegistrationData,
} = slice.actions;

export function* createUserRequestedSaga() {
  const data = yield* select(selectRegistrationData);
  const selectedFlow = yield* select(selectDefinedRegistrationSelectedFlow);
  const invitationId = yield* select(selectInvitationId);

  assertIsDefined(selectedFlow, 'Selected flow must be defined');
  if (!data) {
    console.error('Registration data is not defined');
    yield* put(createUserFailed(null));
    return;
  }
  const {
    confirmPassword,
    businessSectorId0,
    businessSectorId1,
    occupation0,
    occupation1,
    organizationId,
    companyName,
    companyRole,
    nudgeIds,
    ...restData
  } = data;

  const utmParameters = getUtmFromLocalStorage();

  try {
    const userData = {
      ...restData,
      role: UserRoleByFlow[selectedFlow],
      sectorOccupations: formatCareerPathSentence({
        occupation0,
        occupation1,
        businessSectorId0,
        businessSectorId1,
      }),
      department: restData.department.value,
      organizationId: organizationId ? organizationId.value : undefined,
      companyName: companyName ? companyName.value : undefined,
      companyRole: companyRole ? companyRole.value : undefined,
      nudges: nudgeIds?.length
        ? nudgeIds.map((id) => {
            return {
              id,
            } as Nudge;
          })
        : undefined,
      utmSource: utmParameters[UtmParameters.UTM_SOURCE] ?? undefined,
      utmMedium: utmParameters[UtmParameters.UTM_MEDIUM] ?? undefined,
      utmCampaign: utmParameters[UtmParameters.UTM_CAMPAIGN] ?? undefined,
      utmTerm: utmParameters[UtmParameters.UTM_TERM] ?? undefined,
      utmContent: utmParameters[UtmParameters.UTM_CONTENT] ?? undefined,
      utmId: utmParameters[UtmParameters.UTM_ID] ?? undefined,
      invitationId, // Optional, only if the user is registering via an invitation
    };
    yield* call(() => Api.postUserRegistration(userData));

    yield* put(createUserSucceeded());
  } catch (err) {
    if (isConflictError(err)) {
      yield* put(
        createUserFailed({
          error: 'DUPLICATE_EMAIL',
        })
      );
    } else {
      console.error('Error during user registration:', err);
      yield* put(createUserFailed(null));
    }
  }
}

export function* moveForwardInRegistrationSaga() {
  const RegistrationIsEnded = yield* select(selectRegistrationIsEnded);
  // Necessary to force render of form after moving forward but not on last step
  yield* put(setRegistrationIsLoading(true));
  if (!RegistrationIsEnded) {
    yield* call(() => asyncTimeout(300));
    yield* put(setRegistrationIsLoading(false));
  }
}

export function* resetRegistrationDataSaga() {
  // Necessary to force render of form after resetting registration data
  yield* put(setRegistrationIsLoading(true));
  yield* call(() => asyncTimeout(300));
  yield* put(setRegistrationIsLoading(false));
}

export function* saga() {
  yield* takeLatest(createUserRequested, createUserRequestedSaga);
  yield* takeLatest(resetRegistrationData, resetRegistrationDataSaga);
  yield* takeLatest(moveForwardInRegistration, moveForwardInRegistrationSaga);
}
