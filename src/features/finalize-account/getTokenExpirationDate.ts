/**
 * Reads the expiration date of a JWT without verifying it, only to tell the
 * user up front that their activation link has expired. The backend remains
 * the sole judge of the token (signature and expiration). Returns `null` when
 * the token cannot be decoded or carries no expiration.
 */
export function getTokenExpirationDate(token: string): Date | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(base64)) as { exp?: unknown };
    return typeof exp === 'number' ? new Date(exp * 1000) : null;
  } catch {
    return null;
  }
}
