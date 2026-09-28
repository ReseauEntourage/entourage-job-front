/**
 * @jest-environment node
 */
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { processSSEStream } from './MessagingAIAssistant.utils';

const createReader = (
  packets: string[]
): ReadableStreamDefaultReader<Uint8Array> => {
  const encoder = new TextEncoder();
  const queue = packets.map((packet) => encoder.encode(packet));
  return {
    read: async () => {
      const value = queue.shift();
      return value
        ? { done: false as const, value }
        : { done: true as const, value: undefined };
    },
  } as unknown as ReadableStreamDefaultReader<Uint8Array>;
};

const sseEvent = (data: unknown) =>
  `data: ${typeof data === 'string' ? data : JSON.stringify(data)}\n\n`;

const createCallbacks = () => ({
  onContent: jest.fn(),
  onEscalate: jest.fn(),
  onError: jest.fn(),
  onTruncated: jest.fn(),
});

describe('processSSEStream', () => {
  it('reports a completed stream when [DONE] is received', async () => {
    const callbacks = createCallbacks();

    const result = await processSSEStream(
      createReader([
        sseEvent({ content: 'Bonjour' }),
        sseEvent({ content: ' Alex' }),
        sseEvent('[DONE]'),
      ]),
      callbacks
    );

    expect(result).toEqual({ completed: true });
    expect(callbacks.onContent).toHaveBeenNthCalledWith(1, 'Bonjour');
    expect(callbacks.onContent).toHaveBeenNthCalledWith(2, ' Alex');
    expect(callbacks.onTruncated).not.toHaveBeenCalled();
  });

  it('reports an interrupted stream when the connection closes before [DONE]', async () => {
    const callbacks = createCallbacks();

    const result = await processSSEStream(
      createReader([sseEvent({ content: 'elle doit tout sa' })]),
      callbacks
    );

    expect(result).toEqual({ completed: false });
    expect(callbacks.onContent).toHaveBeenCalledWith('elle doit tout sa');
  });

  it('reports an interrupted stream on a non-JSON server error event', async () => {
    const callbacks = createCallbacks();

    const result = await processSSEStream(
      createReader([
        sseEvent({ content: 'Début' }),
        'event: error\ndata: Request timeout\n\n',
      ]),
      callbacks
    );

    expect(result).toEqual({ completed: false });
    expect(callbacks.onError).not.toHaveBeenCalled();
  });

  it('calls onTruncated when the server signals a truncated answer', async () => {
    const callbacks = createCallbacks();

    const result = await processSSEStream(
      createReader([
        sseEvent({ content: 'Réponse longue' }),
        sseEvent({ type: 'truncated' }),
        sseEvent('[DONE]'),
      ]),
      callbacks
    );

    expect(result).toEqual({ completed: true });
    expect(callbacks.onTruncated).toHaveBeenCalledTimes(1);
  });

  it('rebuilds an event split across two packets', async () => {
    const callbacks = createCallbacks();
    const event = sseEvent({ content: "L'entretien avec Gary" });

    const result = await processSSEStream(
      createReader([event.slice(0, 15), event.slice(15), sseEvent('[DONE]')]),
      callbacks
    );

    expect(result).toEqual({ completed: true });
    expect(callbacks.onContent).toHaveBeenCalledWith("L'entretien avec Gary");
  });

  it('reports a completed stream on a JSON error event', async () => {
    const callbacks = createCallbacks();

    const result = await processSSEStream(
      createReader([sseEvent({ error: 'Une erreur est survenue.' })]),
      callbacks
    );

    expect(result).toEqual({ completed: true });
    expect(callbacks.onError).toHaveBeenCalledWith('Une erreur est survenue.');
  });
});
