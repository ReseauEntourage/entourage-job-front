import { randomBytes } from 'crypto';

/**
 * Builds a throwaway password for tests, generated at runtime so no credential
 * is hardcoded in the repository. The "Aa1!" prefix guarantees an upper case
 * letter, a lower case letter, a digit and a special character.
 */
export const buildTestPassword = () => `Aa1!${randomBytes(8).toString('hex')}`;
