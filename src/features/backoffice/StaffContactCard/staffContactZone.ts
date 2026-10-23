import { ADMIN_ZONES, DEPARTMENTS } from '@/src/constants/departements';

/**
 * Label of the zone shown next to a staff contact for a given department.
 * "Hors zone" is displayed as "National" rather than the department's actual region.
 */
export const getStaffContactZoneLabel = (
  department?: string | null
): string | undefined => {
  const deptObj = DEPARTMENTS.find((dept) => dept.name === department);
  return deptObj?.zone === ADMIN_ZONES.HZ ? 'National' : deptObj?.region;
};
