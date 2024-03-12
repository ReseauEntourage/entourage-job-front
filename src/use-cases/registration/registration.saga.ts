import { call, put, select, takeLatest } from 'typed-redux-saga';
import { Api } from 'src/api';
import { flattenRegistrationDataByRole } from 'src/components/registration/Registration.utils';
import { authenticationActions } from 'src/use-cases/authentication';
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

  const { confirmPassword, ...flattenedData } = flattenRegistrationDataByRole(
    data,
    selectedRole
  );

  try {
    const response = yield* call(() =>
      Api.postUserRegistration({
        ...flattenedData,
        role: selectedRole,
        program: selectedProgram,
        department: flattenedData.department.value,
        expectations: flattenedData.expectations
          ? flattenedData.expectations.map((expectation) => ({
              name: expectation,
            }))
          : undefined,
      })
    );
    yield* put(
      authenticationActions.loginSucceeded({
        accessToken: response.data.token,
        user: response.data.user,
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
