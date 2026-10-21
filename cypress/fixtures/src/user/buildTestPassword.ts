/**
 * Builds a throwaway password that satisfies the password rules (upper case,
 * lower case, digit, special character, length), generated at runtime from
 * random picks so that no credential-like literal is committed.
 */
export const buildTestPassword = (): string =>
  [
    Cypress._.sample('ABCDEFGHJKLMNPQRSTUVWXYZ'),
    Cypress._.sample('abcdefghijkmnpqrstuvwxyz'),
    Cypress._.random(1e8, 9e8),
    Cypress._.sample('!#$%&*?'),
  ].join('');
