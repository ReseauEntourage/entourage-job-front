/* eslint-disable @typescript-eslint/no-namespace */
import { generateCampaignsApiResponse } from '../fixtures/src/campaign/generateCampaignsApiResponse';
import { generateCvCandidateApiResponse } from '../fixtures/src/cv/generateCvCandidateApiResponse';
import { generateCvCardsApiResponse } from '../fixtures/src/cv/generateCvCardsApiResponse';
import { generateCvReadApiResponse } from '../fixtures/src/cv/generateCvReadApiResponse';
import { generateCvUrlApiResponse } from '../fixtures/src/cv/generateCvUrlApiResponse';
import { generateAdminLoginApiResponse } from '../fixtures/src/login/generateAdminLoginApiResponse';
import { generateUserLoginApiResponse } from '../fixtures/src/login/generateUserLoginApiResponse';
import { generateOrganizationsApiResponse } from '../fixtures/src/organization/generateOrganizationsApiResponse';
import { generateTabCountApiResponse } from '../fixtures/src/tab/generateTabCountApiResponse';
import { generateSearchUsersApiResponse } from '../fixtures/src/user/generateSearchUsersApiResponse';
import { generateUsersApiResponse } from '../fixtures/src/user/generateUsersApiResponse';

/**
 * Command to generate admin login
 */
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      generateAdminLoginApiResponse(): Chainable<Subject>;
      generateOpportunitiesWrappedApiResponse(): Chainable<Subject>;
      generateUsersApiResponse(roleUsers: string): Chainable<Subject>;
      generateOrganizationsApiResponse(): Chainable<Subject>;
      generateSearchUsersApiResponse(): Chainable<Subject>;
      generateCandidateLoginApiResponse(): Chainable<Subject>;
      generateCvCandidateApiResponse(): Chainable<Subject>;
      generateCoachLoginApiResponse(): Chainable<Subject>;
      generateTabCountApiResponse(): Chainable<Subject>;
      generateCvCardsApiResponse(): Chainable<Subject>;
      generateCvReadApiResponse(): Chainable<Subject>;
      generateCvUrlApiResponse(): Chainable<Subject>;
      generateCampaignsApiResponse(): Chainable<Subject>;
      generateUserProfileReferedApiResponse(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add('generateAdminLoginApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/admin-login.json',
    generateAdminLoginApiResponse(),
    'utf-8'
  );
});

/**
 * Command to generate users
 */
Cypress.Commands.add('generateUsersApiResponse', (roleUsers) => {
  cy.writeFile(
    `cypress/fixtures/api/generated/users-${roleUsers}.json`,
    generateUsersApiResponse(10, roleUsers),
    'utf-8'
  );
});

/**
 * Command to generate structures
 */
Cypress.Commands.add('generateOrganizationsApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/organizations.json',
    generateOrganizationsApiResponse(12),
    'utf-8'
  );
});

/**
 * Command to generate structures
 */
Cypress.Commands.add('generateSearchUsersApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/search-user.json',
    generateSearchUsersApiResponse(5),
    'utf-8'
  );
});

/**
 * Command to generate candidate login
 */
Cypress.Commands.add('generateCandidateLoginApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/candidate-login.json',
    generateUserLoginApiResponse('Candidate'),
    'utf-8'
  );
});

/**
 * Command to generate coach login
 */
Cypress.Commands.add('generateCoachLoginApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/coach-login.json',
    generateUserLoginApiResponse('Coach'),
    'utf-8'
  );
});

/**
 * Command to generate candidate cv
 */
Cypress.Commands.add('generateCvCandidateApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/cv-candidate.json',
    generateCvCandidateApiResponse(),
    'utf-8'
  );
});

/**
 * Command to generate tab Count
 */
Cypress.Commands.add('generateTabCountApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/tab-count.json',
    generateTabCountApiResponse(6),
    'utf-8'
  );
});

/**
 * Command to generate cv read
 */
Cypress.Commands.add('generateTabCountApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/tab-count.json',
    generateTabCountApiResponse(5),
    'utf-8'
  );
});

/**
 * Command to generate cvs card
 */
Cypress.Commands.add('generateCvCardsApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/cv-cards.json',
    generateCvCardsApiResponse(2),
    'utf-8'
  );
});

/**
 * Command to generate cvs card
 */
Cypress.Commands.add('generateCvReadApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/cv-read.json',
    generateCvReadApiResponse(),
    'utf-8'
  );
});

/**
 * Command to generate cv card
 */
Cypress.Commands.add('generateCvUrlApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/cv-url.json',
    generateCvUrlApiResponse(),
    'utf-8'
  );
});

/**
 * Command to generate campaigns
 */
Cypress.Commands.add('generateCampaignsApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/campaigns.json',
    generateCampaignsApiResponse(2),
    'utf-8'
  );
});

/**
 * Command to generate user profile refered
 */
Cypress.Commands.add('generateUserProfileReferedApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/generated/user-profile-refered.json',
    generateCampaignsApiResponse(2),
    'utf-8'
  );
});
