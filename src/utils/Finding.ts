import _ from 'lodash';
import { UserRoles } from '../constants/users';
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

export function isRoleIncluded(
  superset: UserRoles | UserRoles[],
  subset: UserRoles | UserRoles[]
): boolean {
  if (!Array.isArray(subset)) {
    return _.difference([subset], superset).length === 0;
  }
  return _.difference(subset, superset).length === 0;
}
