import { fakerFR as faker } from '@faker-js/faker';

/**
 * Plain builder functions for messaging domain objects (Conversation, Message,
 * ConversationParticipant), used directly as `cy.intercept(..., { body: ... })`
 * payloads inside test files. Unlike the generateXApiResponse() fixtures written
 * to disk in bootstrap(), messaging scenarios vary too much per test (role,
 * feedback flag, message history, availability...) to be worth pre-generating —
 * these builders are meant to be composed inline, test by test.
 */

export const buildParticipant = (overrides: Record<string, any> = {}) => {
  const id = faker.string.uuid();
  return {
    id,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: 'Candidat',
    gender: 0,
    zone: 'PARIS',
    email: faker.internet.exampleEmail(),
    elearningCompletedAt: '2024-01-01T00:00:00.000Z',
    userProfile: { hasPicture: false, unavailableAt: null },
    conversationParticipant: {
      id: faker.string.uuid(),
      seenAt: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    ...overrides,
  };
};

export const buildMessage = (overrides: Record<string, any> = {}) => {
  const author = overrides.author || buildParticipant();
  return {
    id: faker.string.uuid(),
    content: faker.lorem.sentence(),
    authorId: author.id,
    createdAt: '2024-06-01T10:00:00.000Z',
    updatedAt: '2024-06-01T10:00:00.000Z',
    conversationId: faker.string.uuid(),
    medias: [],
    ...overrides,
    author,
  };
};

export const CURRENT_USER_ID = '00000000-0000-0000-0000-000000000001';

/**
 * Builds a `/current` response body with exact UserRoles enum values
 * ('Coach' | 'Candidat' | ...) — the generic login fixtures
 * (candidate-login.json / coach-login.json) use looser role labels
 * ("Coach externe") that don't survive the strict role-equality checks
 * gating quick-replies / starter-suggestions / AI assistant visibility.
 */
export const buildCurrentUser = (overrides: Record<string, any> = {}) => {
  return {
    id: CURRENT_USER_ID,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.exampleEmail(),
    role: 'Candidat',
    gender: 0,
    phone: faker.phone.number(),
    lastConnection: '',
    zone: 'PARIS',
    isEmailVerified: true,
    userSocialSituation: { hasCompletedSurvey: true },
    onboardingStatus: 'completed',
    onboardingCompletedAt: '2024-01-01T00:00:00.000Z',
    onboardingWebinarSkippedAt: null,
    elearningCompletedAt: '2024-01-01T00:00:00.000Z',
    betaFeatures: {},
    hasLinkedinLinked: false,
    ...overrides,
  };
};

export const buildConversation = (overrides: Record<string, any> = {}) => {
  const id = overrides.id || faker.string.uuid();
  const participants = overrides.participants || [
    buildParticipant(),
    buildParticipant(),
  ];
  const messages =
    overrides.messages !== undefined
      ? overrides.messages
      : [buildMessage({ conversationId: id, author: participants[1] })];

  return {
    id,
    type: 'direct',
    createdAt: '2024-06-01T09:00:00.000Z',
    updatedAt: '2024-06-01T10:00:00.000Z',
    seenAt: null,
    shouldGiveFeedback: false,
    ...overrides,
    participants,
    messages,
  };
};
