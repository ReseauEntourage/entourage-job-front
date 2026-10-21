/**
 * The backoffice opens a Pusher connection (WebSocket, then HTTP streaming
 * fallback) as soon as a member is signed in. Specs have no use for realtime
 * events, and in a sandbox without outbound access those long-lived requests
 * reset the Cypress proxy and abort the whole run (`read ECONNRESET`).
 *
 * `interceptRealtime` stubs the HTTP fallback; `blockRealtimeSockets` (to pass
 * as `onBeforeLoad` of `cy.visit`) stops the WebSocket attempt.
 */
export const interceptRealtime = () => {
  cy.intercept({ url: /pusher\.com/ }, { statusCode: 404, body: '' });
};

export const blockRealtimeSockets = (win: Cypress.AUTWindow) => {
  const NativeWebSocket = win.WebSocket;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (win as any).WebSocket = function BlockedWebSocket(
    url: string | URL,
    ...args: [] | [string | string[]]
  ) {
    if (String(url).includes('pusher.com')) {
      throw new Error('Realtime connection blocked in e2e tests');
    }
    return new NativeWebSocket(url, ...args);
  };
};
