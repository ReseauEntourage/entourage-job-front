import { call, put, select, takeLatest } from 'typed-redux-saga';
import { flattenRegistrationData } from '../../components/registration/Registration.utils';
import { Api } from 'src/api';
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

  const flattenedData = flattenRegistrationData(data, selectedRole);

  try {
    yield* call(() =>
      Api.postUserRegistration({
        ...flattenedData,
        role: selectedRole,
        program: selectedProgram,
      })
    );
    yield* put(createUserSucceeded());
  } catch (err) {
    yield* put(createUserFailed());
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
