/**
 * Intercepts for the messaging feature (/backoffice/messaging + dashboard widget).
 * Function-based (à la auth.req.ts) since every messaging scenario needs a
 * different conversations/messages payload depending on role, feedback flag,
 * unread state, etc.
 */

export const interceptGetConversations = (data: object) => {
  cy.intercept('GET', '/messaging/conversations', data).as('getConversations');
};

export const interceptGetUnseenCount = (data: object) => {
  cy.intercept('GET', '/messaging/conversations/unseen-count', data).as(
    'getUnseenCount'
  );
};

// Excludes /messaging/conversations/unseen-count, which shares the same shape
// (GET, single path segment) but must be intercepted separately.
export const interceptGetConversationById = (data: object) => {
  cy.intercept(
    'GET',
    /\/messaging\/conversations\/(?!unseen-count)[^/?]+(\?.*)?$/,
    data
  ).as('getConversationById');
};

export const interceptPostMessage = (data: object) => {
  cy.intercept('POST', '/messaging/messages', data).as('postMessage');
};

export const interceptPostFeedback = (data: object) => {
  cy.intercept('POST', '/messaging/conversations/feedback', data).as(
    'postFeedback'
  );
};

export const interceptReportConversation = (data: object) => {
  cy.intercept('POST', '/messaging/conversations/*/report', data).as(
    'postReportConversation'
  );
};

export const interceptGetPublicProfile = (data: object) => {
  cy.intercept('GET', '/user/profile/*', data).as('getPublicProfile');
};

export const interceptGetAISession = (data: object) => {
  cy.intercept('GET', '/ai-assistant/conversations/*/session', data).as(
    'getAISession'
  );
};

export const interceptResetAISession = (data: object) => {
  cy.intercept(
    'DELETE',
    '/ai-assistant/conversations/*/session/messages',
    data
  ).as('resetAISession');
};

/**
 * The AI assistant reply is consumed over `fetch` as an SSE stream
 * (`Api.streamAIMessage`), read chunk by chunk via `response.body.getReader()`.
 * cy.intercept can't produce a genuinely multi-chunk stream, but returning the
 * full SSE-formatted text as the body works: fetch still exposes a
 * ReadableStream, and the consumer's `processSSEStream` just gets it all in one
 * read() — sufficient to exercise the parsing/rendering logic, not real network
 * chunking/timing.
 */
export const interceptAIStream = (sseBody: string, statusCode = 200) => {
  cy.intercept('POST', '/ai-assistant/conversations/*/stream', {
    statusCode,
    headers: { 'content-type': 'text/event-stream' },
    body: sseBody,
  }).as('postAIStream');
};

export const sseEvent = (payload: object) =>
  `data: ${JSON.stringify(payload)}\n\n`;

export const interceptShareProfile = (data: object) => {
  cy.intercept('POST', '/user/profile/*/shares', data).as('postShareProfile');
};

export const interceptGetProfileShareText = (data: object) => {
  cy.intercept('GET', '/user/profile/*/share-text*', data).as(
    'getProfileShareText'
  );
};
