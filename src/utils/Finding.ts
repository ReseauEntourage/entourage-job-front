import _ from 'lodash';
import { UserCandidateWithUsers, UserWithUserCandidate } from 'src/api/types';
import { OFFER_STATUS } from 'src/constants';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  UserRole,
} from 'src/constants/users';
import { FilterConstant } from 'src/constants/utils';

export function findOfferStatus(status, isPublic, isRecommended) {
  const currentStatus = OFFER_STATUS.find((oStatus) => {
    return oStatus.value === status;
  });
  if (currentStatus) {
    if (isPublic) {
      if (isRecommended && currentStatus.recommended) {
        return {
          label: currentStatus.recommended,
          value: currentStatus.value,
          color: currentStatus.color,
        };
      }
      if (currentStatus.public) {
        return {
          label: currentStatus.public,
          value: currentStatus.value,
          color: currentStatus.color,
        };
      }
    }
    return {
      label: currentStatus.label,
      value: currentStatus.value,
      color: currentStatus.color,
    };
  }
  return { label: 'Non défini', color: 'muted' };
}

export function findConstantFromValue<T extends FilterConstant>(
  valToFind: string | boolean | number,
  constantsToFindFrom: readonly T[]
): T {
  return (
    constantsToFindFrom.find(({ value }) => {
      return value === valToFind;
    }) ||
    ({
      label: valToFind,
      value: valToFind,
    } as T)
  );
}

export function getValueFromFormField<T extends string | number | boolean>(
  fieldValue: FilterConstant<T> | FilterConstant<T>[]
) {
  // TODO GENERIC TYPE
  if (_.isArray(fieldValue)) {
    if (
      _.every(fieldValue, (fieldVal) => {
        return _.isObject(fieldVal) && _.has(fieldVal, 'value');
      })
    ) {
      return fieldValue.map(({ value }) => {
        return value;
      });
    }
  } else if (_.isObject(fieldValue) && _.has(fieldValue, 'value')) {
    return fieldValue.value;
  }
  return fieldValue;
}

export function isRoleIncluded(
  superset: readonly UserRole[],
  subset: UserRole | UserRole[]
) {
  if (!Array.isArray(subset)) {
    return _.difference([subset], superset).length === 0;
  }
  return _.difference(subset, superset).length === 0;
}

export function getUserCandidateFromCoachOrCandidate(member: UserWithUserCandidate) : UserCandidateWithUsers | UserCandidateWithUsers[] | null{
  if (member) {
    if (isRoleIncluded(CANDIDATE_USER_ROLES, member.role) && !!member.candidat) {
      return member.candidat;
    }

    if (isRoleIncluded(COACH_USER_ROLES, member.role) && !!member.coaches) {
      return member.coaches;
    }
  }
  return null;
}

export function getRelatedUser(
  member: UserWithUserCandidate
): UserWithUserCandidate[] {
  if (member) {
    if (member.candidat && member.candidat.coach) {
      return [member.candidat.coach];
    }
    if (member.coaches && member.coaches.length > 0) {
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      return member.coaches.map(({ candidat }) => {
        return candidat;
      });
    }
  }

  // @ts-expect-error after enable TS strict mode. Please, try to fix it
  return null;
}

export function getCoachFromCandidate(candidate) {
  if (candidate && isRoleIncluded(CANDIDATE_USER_ROLES, candidate.role)) {
    if (candidate.candidat && candidate.candidat.coach) {
      return candidate.candidat.coach;
    }
  }

  return null;
}

export function getUserCandidateFromCoach(coach, candidateId) {
  if (coach && isRoleIncluded(COACH_USER_ROLES, coach.role)) {
    if (coach.coaches && coach.coaches.length > 0) {
      return coach.coaches.find(({ candidat }) => {
        return candidat.id === candidateId;
      });
    }
  }
  return null;
}

export function getCandidateFromCoach(coach, candidateId) {
  return getUserCandidateFromCoach(coach, candidateId)?.candidat;
}

export function getCandidateIdFromCoachOrCandidate(member) {
  if (member) {
    if (isRoleIncluded(CANDIDATE_USER_ROLES, member.role)) {
      return member.id;
    }

    if (
      isRoleIncluded(COACH_USER_ROLES, member.role) &&
      member.coaches &&
      member.coaches.length > 0
    ) {
      return member.coaches.map(({ candidat }) => {
        return candidat.id;
      });
    }
  }
  return null;
}
