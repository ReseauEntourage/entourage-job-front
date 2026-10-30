// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ADMIN_ZONES, DEPARTMENTS } from '@/src/constants/departements';
import { getStaffContactZoneLabel } from './staffContactZone';

describe('getStaffContactZoneLabel', () => {
  it('returns the region of a covered department', () => {
    expect(getStaffContactZoneLabel('Nord (59)')).toBe('Hauts-de-France');
  });

  it('returns "National" for a department outside the covered zones', () => {
    const outOfZone = DEPARTMENTS.find((dept) => dept.zone === ADMIN_ZONES.HZ);
    expect(outOfZone).toBeDefined();
    expect(getStaffContactZoneLabel(outOfZone?.name)).toBe('National');
  });

  it('returns undefined when the department is unknown or missing', () => {
    expect(getStaffContactZoneLabel('Inconnu')).toBeUndefined();
    expect(getStaffContactZoneLabel(undefined)).toBeUndefined();
    expect(getStaffContactZoneLabel(null)).toBeUndefined();
  });
});
