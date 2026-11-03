export const ONBOARDING_DEFAULT_EXIT_PATH = '/backoffice/dashboard';

const BACKOFFICE_PATH_PREFIX = '/backoffice/';

/**
 * Validates the page a user was sent away from when redirected to the
 * onboarding (`?requestedPath=` on the wizard URL). Only a backoffice page of
 * the current origin is kept, so the wizard can never send anyone to another
 * site nor back to itself. The value is resolved the way the browser would
 * (e.g. `/\evil.example` becomes `https://evil.example`).
 * Returns `null` when the value is missing or not acceptable.
 */
export const getValidRequestedPath = (
  requestedPath: unknown
): string | null => {
  if (typeof requestedPath !== 'string' || !requestedPath.startsWith('/')) {
    return null;
  }
  try {
    const { origin } = window.location;
    const url = new URL(requestedPath, origin);
    if (
      url.origin !== origin ||
      !url.pathname.startsWith(BACKOFFICE_PATH_PREFIX)
    ) {
      return null;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
};

/**
 * Page reached at the end of the onboarding when no recap action handles the
 * navigation: the requested backoffice page if valid, the dashboard otherwise.
 */
export const resolveOnboardingExitPath = (requestedPath: unknown): string =>
  getValidRequestedPath(requestedPath) ?? ONBOARDING_DEFAULT_EXIT_PATH;
