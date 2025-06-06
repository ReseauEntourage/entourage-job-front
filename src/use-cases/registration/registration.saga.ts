import { call, put, select, takeLatest } from 'typed-redux-saga';
import { Nudge } from '@/src/api/types';
import { UtmParameters } from '@/src/hooks/queryParams/useUTM';
import { Api } from 'src/api';
import { isConflictError } from 'src/api/axiosErrors';
import {
  flattenRegistrationDataByRole,
  getUtmFromLocalStorage,
} from 'src/components/registration/Registration.utils';
import { formatCareerPathSentence } from 'src/utils';
import { asyncTimeout } from 'src/utils/asyncTimeout';
import {
  selectDefinedRegistrationSelectedProgram,
  selectDefinedRegistrationSelectedRole,
  selectIsLastRegistrationStep,
  selectRegistrationData,
} from './registration.selectors';
import { slice } from './registration.slice';

const {
  createUserSucceeded,
  createUserRequested,
  createUserFailed,
  setRegistrationCurrentStepData,
  setRegistrationStep,
  setRegistrationIsLoading,
} = slice.actions;

export function* createUserRequestedSaga() {
  const data = yield* select(selectRegistrationData);
  const selectedRole = yield* select(selectDefinedRegistrationSelectedRole);
  const selectedProgram = yield* select(
    selectDefinedRegistrationSelectedProgram
  );

  const {
    confirmPassword,
    businessSectorId0,
    businessSectorId1,
    occupation0,
    occupation1,
    organizationId,
    nudgeIds,
    ...flattenedData
  } = flattenRegistrationDataByRole(data, selectedRole);

  const utmParameters = getUtmFromLocalStorage();

  try {
    yield* call(() =>
      Api.postUserRegistration({
        ...flattenedData,
        role: selectedRole,
        program: selectedProgram,
        sectorOccupations: formatCareerPathSentence({
          occupation0,
          occupation1,
          businessSectorId0,
          businessSectorId1,
        }),
        department: flattenedData.department.value,
        organizationId: organizationId ? organizationId.value : undefined,
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
      })
    );

    yield* put(createUserSucceeded());
  } catch (err) {
    if (isConflictError(err)) {
      yield* put(
        createUserFailed({
          error: 'DUPLICATE_EMAIL',
        })
      );
    } else {
      yield* put(createUserFailed(null));
    }
  }
}

export function* setRegistrationCurrentStepDataSaga() {
  const isLastRegistrationStep = yield* select(selectIsLastRegistrationStep);
  if (isLastRegistrationStep) {
    yield* put(setRegistrationIsLoading(true));
    yield* put(createUserRequested());
  }
}

export function* setRegistrationStepSaga() {
  // Necessary to force render of form on step change
  yield* call(() => asyncTimeout(500));
  yield* put(setRegistrationIsLoading(false));
}

export function* saga() {
  yield* takeLatest(createUserRequested, createUserRequestedSaga);
  yield* takeLatest(
    setRegistrationCurrentStepData,
    setRegistrationCurrentStepDataSaga
  );
  yield* takeLatest(setRegistrationStep, setRegistrationStepSaga);
}
