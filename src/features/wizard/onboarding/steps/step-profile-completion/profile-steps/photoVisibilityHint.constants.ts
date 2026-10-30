import { UserRoles } from '@/src/constants/users';

// Hint shown on the photo step while the user has no photo, for the two roles
// that go through the onboarding. Hard-coded on purpose: the figure comes from
// an internal Entourage Pro statistic and is not tracked in the product.
export const PHOTO_VISIBILITY_HINTS: Partial<Record<UserRoles, string>> = {
  [UserRoles.CANDIDATE]:
    "Les profils avec une photo ont 2 fois plus de chances d'être contactés par des coachs.",
  [UserRoles.COACH]:
    "Les profils avec une photo ont 2 fois plus de chances d'être contactés par des candidats.",
};
