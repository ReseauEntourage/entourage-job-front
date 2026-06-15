import { call, put, select, takeLatest } from 'typed-redux-saga';
import { Api } from 'src/api';
import { isConflictError } from 'src/api/axiosErrors';
import { selectWizardData, selectWizardUserId } from './wizard.selectors';
import { slice } from './wizard.slice';
import { WizardSubStep } from './wizard.types';

const {
  createAccountRequested,
  createAccountSucceeded,
  createAccountFailed,
  sendOtpRequested,
  sendOtpSucceeded,
  sendOtpFailed,
  verifyOtpRequested,
  verifyOtpSucceeded,
  verifyOtpFailed,
  resumeWizardRequested,
  resumeWizardSucceeded,
  resumeWizardFailed,
  moveToSubStep,
} = slice.actions;

const createAccountSaga = function* () {
  const data = yield* select(selectWizardData);
  try {
    const response = yield* call(() =>
      Api.postUserRegistration({
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
        password: data.password ?? '',
        role: data.role as Parameters<typeof Api.postUserRegistration>[0]['role'],
        department: data.department?.value as Parameters<
          typeof Api.postUserRegistration
        >[0]['department'],
        birthDate: data.birthDate ?? '',
        workingRight: data.workingRight,
        sectorOccupations: data.sectorOccupations,
      })
    );
    const userId: string = response.data?.id;
    yield* put(createAccountSucceeded(userId));
    yield* put(sendOtpRequested());
  } catch (err) {
    if (isConflictError(err)) {
      yield* put(createAccountFailed('conflict'));
    } else {
      console.error('Error during wizard account creation:', err);
      yield* put(createAccountFailed('unknown'));
    }
  }
};

const sendOtpSaga = function* () {
  const userId = yield* select(selectWizardUserId);
  if (!userId) {
    yield* put(sendOtpFailed());
    return;
  }
  try {
    yield* call(() => Api.postUserSendOtp({ userId }));
    yield* put(sendOtpSucceeded());
    yield* put(moveToSubStep('1.5-otp'));
  } catch (err) {
    console.error('Error sending OTP:', err);
    yield* put(sendOtpFailed());
  }
};

const verifyOtpSaga = function* (
  action: ReturnType<typeof verifyOtpRequested>
) {
  const userId = yield* select(selectWizardUserId);
  const code = action.payload.code;
  if (!userId) {
    return;
  }
  try {
    yield* call(() => Api.postUserVerifyOtp({ userId, code }));
    yield* put(verifyOtpSucceeded());
    yield* put(moveToSubStep('2.1-elearning'));
  } catch (err: unknown) {
    const errorCode = (err as { response?: { data?: { message?: string } } })
      ?.response?.data?.message;
    yield* put(
      verifyOtpFailed(
        errorCode === 'MAX_ATTEMPTS' || errorCode === 'EXPIRED'
          ? errorCode
          : 'INVALID_CODE'
      )
    );
  }
};

const resumeWizardSaga = function* () {
  try {
    const response = yield* call(() => Api.getUserWizardState());
    const { nextStep, userData } = response.data;
    yield* put(
      resumeWizardSucceeded({
        nextStep: nextStep as WizardSubStep,
        userData,
      })
    );
  } catch {
    yield* put(resumeWizardFailed());
  }
};

export function* saga() {
  yield* takeLatest(createAccountRequested, createAccountSaga);
  yield* takeLatest(sendOtpRequested, sendOtpSaga);
  yield* takeLatest(verifyOtpRequested, verifyOtpSaga);
  yield* takeLatest(resumeWizardRequested, resumeWizardSaga);
}
