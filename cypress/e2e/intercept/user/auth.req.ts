/**
 * Intercepts for the authentication flow (login, forgot password, reset password).
 * Unlike admin.req.ts / visitor.req.ts, these are exposed as functions rather than
 * a static array, since each test scenario needs a different response (success,
 * invalid credentials, unverified email, rate limit...).
 */

export const interceptLogin = (data: object) => {
  cy.intercept('POST', '/auth/login', data).as('postLogin');
};

export const interceptForgotPassword = (data: object) => {
  cy.intercept('POST', '/auth/forgot', data).as('postForgotPassword');
};

export const interceptResetPassword = (data: object) => {
  cy.intercept('POST', '/auth/reset/*/*', data).as('postResetPassword');
};

export const interceptCurrentUser = (data: object) => {
  cy.intercept('GET', '/current', data).as('getCurrent');
};
