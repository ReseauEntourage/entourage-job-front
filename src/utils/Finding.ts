import _ from 'lodash';
import { UserRoles } from '../constants/users';
import {
  User,
  UserCandidateWithUsers,
  UserWithUserCandidate,
} from 'src/api/types';
import { FilterConstant } from 'src/constants/utils';

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
  if (_.isArray(fieldValue)) {
    if (
      _.every(fieldValue, (fieldVal) => {
        return _.isObject(fieldVal) && _.has(fieldVal, 'value');
      })
    ) {
      return (fieldValue as FilterConstant<T>[]).map(({ value }) => {
        return value;
      });
    }
  } else if (_.isObject(fieldValue) && _.has(fieldValue, 'value')) {
    return (fieldValue as FilterConstant<T>).value;
  }
  return fieldValue;
}

export function isRoleIncluded(
  superset: UserRoles | UserRoles[],
  subset: UserRoles | UserRoles[]
): boolean {
  if (!Array.isArray(subset)) {
    return _.difference([subset], superset).length === 0;
  }
  return _.difference(subset, superset).length === 0;
}

export function getUserCandidateFromCoachOrCandidate(
  member: UserWithUserCandidate
): UserCandidateWithUsers | UserCandidateWithUsers[] | null {
  if (member) {
    if (member.role === UserRoles.CANDIDATE && !!member.candidat) {
      return member.candidat;
    }

    if (member.role === UserRoles.COACH && !!member.coaches) {
      return member.coaches;
    }
  }
  return null;
}

export function getRelatedUser(
  member: UserWithUserCandidate
): UserWithUserCandidate[] | null {
  if (member) {
    if (member.candidat && member.candidat.coach) {
      return [member.candidat.coach];
    }
    if (member.coaches && member.coaches.length > 0) {
      return member.coaches.map(({ candidat }) => {
        return candidat;
      });
    }
  }
  return null;
}

export function getCoachFromCandidate(
  candidate: UserWithUserCandidate
): UserWithUserCandidate | null {
  if (candidate && candidate.role === UserRoles.CANDIDATE) {
    if (candidate.candidat && candidate.candidat.coach) {
      return candidate.candidat.coach;
    }
  }
  return null;
}

export function getUserCandidateFromCoach(
  coach: UserWithUserCandidate,
  candidateId: string
): UserCandidateWithUsers | null {
  if (coach && coach.role === UserRoles.COACH) {
    if (coach.coaches && coach.coaches.length > 0) {
      const candidate = coach.coaches.find(({ candidat }) => {
        return candidat?.id === candidateId;
      });
      if (candidate) {
        return candidate;
      }
    }
  }
  return null;
}

export function getCandidateFromCoach(
  coach: UserWithUserCandidate,
  candidateId: string
): User | undefined {
  return getUserCandidateFromCoach(coach, candidateId)?.candidat;
}

export function getCandidateIdFromCoachOrCandidate(
  member: UserWithUserCandidate
): string | string[] | null {
  if (member) {
    if (member.role === UserRoles.CANDIDATE) {
      return member.id;
    }

    if (
      member.role === UserRoles.COACH &&
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
