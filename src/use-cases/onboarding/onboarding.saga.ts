import { call, put, select, takeLatest } from 'typed-redux-saga';
import {
  currentUserActions,
  selectAuthenticatedUser,
  selectCurrentUserId,
  selectCurrentUserProfile,
  selectCurrentUserProfileHelps,
} from '../current-user';
import { Api } from 'src/api';
import { USER_ROLES } from 'src/constants/users';
import { isRoleIncluded } from 'src/utils';
import { slice } from './onboarding.slice';

const {
  setOnboardingStep,
  launchOnboarding,
  validateFirstSecondStepOnboardingRequested,
  validateFirstSecondStepOnboardingSucceeded,
  validateFirstSecondStepOnboardingFailed,
  validateLastStepOnboardingRequested,
  validateLastStepOnboardingSucceeded,
  validateLastStepOnboardingFailed,
  increaseOnboardingStep,
  endOnboarding,
} = slice.actions;

export function* launchOnboardingSaga() {
  const currentUser = yield* select(selectAuthenticatedUser);
  const userProfile = yield* select(selectCurrentUserProfile);
  const userRole = currentUser.role;
  const userHelps = yield* select(selectCurrentUserProfileHelps);
  const candidateWithBusinessLine =
    userRole === USER_ROLES.CANDIDATE &&
    userProfile.searchBusinessLines &&
    userProfile.searchBusinessLines.length > 0;
  const coachWithBusinessLine =
    userRole === USER_ROLES.COACH &&
    userProfile.networkBusinessLines &&
    userProfile.networkBusinessLines.length > 0;
  const onBoardingDone =
    (candidateWithBusinessLine || coachWithBusinessLine) &&
    userProfile.description;

  // if admin or external Coach, no Onboarding
  if (isRoleIncluded([USER_ROLES.ADMIN, USER_ROLES.REFERRER], userRole)) {
    yield* put(endOnboarding());
  }

  // if no helps, step 1
  if (!userHelps || userHelps.length === 0) {
    yield* put(setOnboardingStep(1));
  } else if (onBoardingDone) {
    yield* put(endOnboarding());
  } else {
    yield* put(setOnboardingStep(2));
  }
}

export function* validateFirstSecondStepOnboardingSaga(
  action: ReturnType<typeof validateFirstSecondStepOnboardingRequested>
) {
  const userId = yield* select(selectCurrentUserId);
  const { userProfile } = action.payload;
  try {
    yield* call(() => Api.putUserProfile(userId, userProfile));
    yield* put(validateFirstSecondStepOnboardingSucceeded());
    // If user has uploaded an external CV, upload it
    if (action.payload.externalCv) {
      const formData = new FormData();
      formData.append('file', action.payload.externalCv);
      yield* put(currentUserActions.uploadExternalCvRequested(formData));
    }
    yield* put(currentUserActions.fetchUserRequested());
    yield* put(increaseOnboardingStep());
  } catch {
    yield* put(validateFirstSecondStepOnboardingFailed());
  }
}

export function* validateLastStepOnboardingSaga(
  action: ReturnType<typeof validateLastStepOnboardingRequested>
) {
  const user = yield* select(selectAuthenticatedUser);
  const { userProfile, optinNewsletter } = action.payload;

  try {
    // Update user profile with new data
    yield* call(() => Api.putUserProfile(user.id, userProfile));

    // If user optin for newsletter, call api to set OK to receive newsletter
    if (optinNewsletter) {
      // Call api to set OK to receive newsletter
      yield* call(() => {
        Api.postNewsletter({
          email: user.email,
          zone: user.zone,
          status: user.candidat ? 'CANDIDAT' : 'PARTICULIER',
        });
      });
    }
    yield* put(validateLastStepOnboardingSucceeded());
    yield* put(currentUserActions.fetchUserRequested());
    yield* put(endOnboarding());
  } catch {
    yield* put(validateLastStepOnboardingFailed());
  }
}

export function* saga() {
  yield* takeLatest(launchOnboarding, launchOnboardingSaga);
  yield* takeLatest(
    validateFirstSecondStepOnboardingRequested,
    validateFirstSecondStepOnboardingSaga
  );
  yield* takeLatest(
    validateLastStepOnboardingRequested,
    validateLastStepOnboardingSaga
  );
}
