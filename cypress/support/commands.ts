import { generateAdminLoginApiResponse } from '../fixtures/src/login/generateAdminLoginApiResponse';
import { generateUserLoginApiResponse } from '../fixtures/src/login/generateUserLoginApiResponse';
import { generateOpportunitiesApiResponse } from '../fixtures/src/opportunity/generateOpportunitiesApiResponse';
import { generateUsersApiResponse } from '../fixtures/src/user/generateUsersApiResponse';
import { generateOrganizationsApiResponse } from '../fixtures/src/organization/generateOrganizationsApiResponse';
import { generateSearchUsersApiResponse } from '../fixtures/src/user/generateSearchUsersApiResponse';
import { generateCvCandidateApiResponse } from '../fixtures/src/cv/generateCvCandidateApiResponse';
import { generateTabCountApiResponse } from '../fixtures/src/tab/generateTabCountApiResponse';
import { generateCvCardsApiResponse } from '../fixtures/src/cv/generateCvCardsApiResponse';
import { generateCampaignsApiResponse } from '../fixtures/src/campaign/generateCampaignsApiResponse';
import { generateCvReadApiResponse } from '../fixtures/src/cv/generateCvReadApiResponse';
import { generateCvUrlApiResponse } from '../fixtures/src/cv/generateCvUrlApiResponse';

/**
 * Command to generate admin login
 */
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      generateAdminLoginApiResponse(): Chainable<Subject>;
      generateOpportunitiesApiResponse(): Chainable<Subject>;
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
    }
  }
}

Cypress.Commands.add('generateAdminLoginApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/admin-login.json',
    generateAdminLoginApiResponse(),
    'utf-8'
  );
});

/**
 * Command to generate opportunities
 */
Cypress.Commands.add('generateOpportunitiesApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/opportunities.json',
    generateOpportunitiesApiResponse(5, 2),
    'utf-8'
  );
});

/**
 * Command to generate opportunities wrapped for candidates
 */
Cypress.Commands.add('generateOpportunitiesWrappedApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/opportunities-wrapped.json',
    generateOpportunitiesApiResponse(5, 2, true),
    'utf-8'
  );
});

/**
 * Command to generate users
 */
Cypress.Commands.add('generateUsersApiResponse', (roleUsers) => {
  cy.writeFile(
    `cypress/fixtures/api/users-${roleUsers}.json`,
    generateUsersApiResponse(10, roleUsers),
    'utf-8'
  );
});

/**
 * Command to generate structures
 */
Cypress.Commands.add('generateOrganizationsApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/organizations.json',
    generateOrganizationsApiResponse(12),
    'utf-8'
  );
});

/**
 * Command to generate structures
 */
Cypress.Commands.add('generateSearchUsersApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/search-user.json',
    generateSearchUsersApiResponse(5),
    'utf-8'
  );
});

/**
 * Command to generate candidate login
 */
Cypress.Commands.add('generateCandidateLoginApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/candidate-login.json',
    generateUserLoginApiResponse('Candidate'),
    'utf-8'
  );
});

/**
 * Command to generate coach login
 */
Cypress.Commands.add('generateCoachLoginApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/coach-login.json',
    generateUserLoginApiResponse('Coach'),
    'utf-8'
  );
});

/**
 * Command to generate candidate cv
 */
Cypress.Commands.add('generateCvCandidateApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/cv-candidate.json',
    generateCvCandidateApiResponse(),
    'utf-8'
  );
});

/**
 * Command to generate tab Count
 */
Cypress.Commands.add('generateTabCountApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/tab-count.json',
    generateTabCountApiResponse(6),
    'utf-8'
  );
});

/**
 * Command to generate cv read
 */
Cypress.Commands.add('generateTabCountApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/tab-count.json',
    generateTabCountApiResponse(5),
    'utf-8'
  );
});

/**
 * Command to generate cvs card
 */
Cypress.Commands.add('generateCvCardsApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/cv-cards.json',
    generateCvCardsApiResponse(2),
    'utf-8'
  );
});

/**
 * Command to generate cvs card
 */
Cypress.Commands.add('generateCvReadApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/cv-read.json',
    generateCvReadApiResponse(),
    'utf-8'
  );
});

/**
 * Command to generate cv card
 */
Cypress.Commands.add('generateCvUrlApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/cv-url.json',
    generateCvUrlApiResponse(),
    'utf-8'
  );
});

/**
 * Command to generate campaigns
 */
Cypress.Commands.add('generateCampaignsApiResponse', () => {
  cy.writeFile(
    'cypress/fixtures/api/campaigns.json',
    generateCampaignsApiResponse(2),
    'utf-8'
  );
});
