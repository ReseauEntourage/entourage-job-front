import _ from 'lodash';
import { UserRoles } from '../constants/users';
import { UserCandidateWithUsers, UserWithUserCandidate } from 'src/api/types';
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
  }
  return null;
}

export function getCandidateIdFromCoachOrCandidate(
  member: UserWithUserCandidate
): string | string[] | null {
  if (member) {
    if (member.role === UserRoles.CANDIDATE) {
      return member.id;
    }
  }
  return null;
}
