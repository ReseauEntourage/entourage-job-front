// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import { findConstantFromValue, isRoleIncluded } from './Finding';

describe('findConstantFromValue', () => {
  const constants = [
    { label: 'Yes', value: true },
    { label: 'One', value: 1 },
    { label: 'Text', value: 'text' },
  ];

  it('returns the matching constant', () => {
    expect(findConstantFromValue(1, constants)).toBe(constants[1]);
    expect(findConstantFromValue('text', constants)).toBe(constants[2]);
  });

  it('falls back to a constant built from the raw value', () => {
    expect(findConstantFromValue('unknown', constants)).toEqual({
      label: 'unknown',
      value: 'unknown',
    });
  });

  it('does not coerce types when matching', () => {
    expect(findConstantFromValue('1', constants)).toEqual({
      label: '1',
      value: '1',
    });
  });
});

describe('isRoleIncluded', () => {
  it('handles a single role as subset', () => {
    expect(
      isRoleIncluded([UserRoles.ADMIN, UserRoles.COACH], UserRoles.COACH)
    ).toBe(true);
    expect(isRoleIncluded([UserRoles.ADMIN], UserRoles.COACH)).toBe(false);
  });

  it('handles an array subset: every role must be in the superset', () => {
    expect(
      isRoleIncluded(
        [UserRoles.ADMIN, UserRoles.COACH],
        [UserRoles.COACH, UserRoles.ADMIN]
      )
    ).toBe(true);
    expect(
      isRoleIncluded([UserRoles.ADMIN], [UserRoles.ADMIN, UserRoles.COACH])
    ).toBe(false);
  });

  it('treats an empty subset as included', () => {
    expect(isRoleIncluded([UserRoles.ADMIN], [])).toBe(true);
  });
});
