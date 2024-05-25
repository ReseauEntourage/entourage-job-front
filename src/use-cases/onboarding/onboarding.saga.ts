import { call, put, select, takeLatest } from 'typed-redux-saga';
import { currentUser as currentUserUseCase } from '../current-user';
import { Api } from 'src/api';
import { USER_ROLES, CANDIDATE_USER_ROLES } from 'src/constants/users';
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
  const currentUser = yield* select(
    currentUserUseCase.selectors.selectAuthenticatedUser
  );
  const userProfile = yield* select(
    currentUserUseCase.selectors.selectCurrentUserProfile
  );
  const userRole = currentUser.role;
  const userHelps = yield* select(
    currentUserUseCase.selectors.selectCurrentUserProfileHelps
  );

  // if admin or external Coach, no Onboarding
  if (isRoleIncluded([USER_ROLES.ADMIN, USER_ROLES.COACH_EXTERNAL], userRole)) {
    yield* put(endOnboarding());
  }

  // if no helps, step 1
  if (!userHelps || userHelps.length === 0) {
    yield* put(setOnboardingStep(1));
  }
  // if is coach and no sector or if candidate and no sector, step 2
  else if (
    (isRoleIncluded(CANDIDATE_USER_ROLES, userRole) &&
      (!userProfile.searchBusinessLines ||
        userProfile.searchBusinessLines.length === 0)) ||
    (USER_ROLES.COACH === userRole &&
      (!userProfile.networkBusinessLines ||
        userProfile.networkBusinessLines.length === 0))
  ) {
    yield* put(setOnboardingStep(2));
  }
  // if no description, step 3
  else if (!userProfile.description) {
    yield* put(setOnboardingStep(3));
  }
  // else no step
  else {
    yield* put(endOnboarding());
  }
}

export function* validateFirstSecondStepOnboardingSaga(
  action: ReturnType<typeof validateFirstSecondStepOnboardingRequested>
) {
  const userId = yield* select(
    currentUserUseCase.selectors.selectCurrentUserId
  );
  const userProfile = action.payload;
  try {
    yield* call(() => Api.putUserProfile(userId, userProfile));
    yield* put(validateFirstSecondStepOnboardingSucceeded());
    yield* put(currentUserUseCase.actions.fetchUserRequested());
    yield* put(increaseOnboardingStep());
  } catch {
    yield* put(validateFirstSecondStepOnboardingFailed());
  }
}

export function* validateLastStepOnboardingSaga(
  action: ReturnType<typeof validateLastStepOnboardingRequested>
) {
  const userId = yield* select(
    currentUserUseCase.selectors.selectCurrentUserId
  );
  const userProfile = action.payload;
  try {
    yield* call(() => Api.putUserProfile(userId, userProfile));
    yield* put(validateLastStepOnboardingSucceeded());
    yield* put(currentUserUseCase.actions.fetchUserRequested());
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
