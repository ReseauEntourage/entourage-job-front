import { useMemo } from 'react';
import { StaffContact } from '@/src/api/types';
import { getStaffContactZoneLabel } from '@/src/features/backoffice/StaffContactCard/staffContactZone';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useCurrentUserStaffContact } from '@/src/hooks/useCurrentUserStaffContact';

export interface OnboardingReferentContactData {
  contact: StaffContact;
  zoneLabel: string;
}

/**
 * Referent contact shown during the connected onboarding. Returns null until
 * both the contact and its zone are known, or when no contact is available, so
 * callers render nothing and the step stays usable.
 */
export const useOnboardingReferentContact =
  (): OnboardingReferentContactData | null => {
    const profile = useCurrentUserProfile();
    const contact = useCurrentUserStaffContact();

    const zoneLabel = useMemo(
      () => getStaffContactZoneLabel(profile?.department),
      [profile?.department]
    );

    if (!contact?.email || !zoneLabel) {
      return null;
    }
    return { contact, zoneLabel };
  };
